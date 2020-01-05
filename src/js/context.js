import { getLemma, search } from "@/services"

export const contextMenuItem = {
    id: "termania_menu",
    title: "Search on Termania.net",
    contexts: [
        "selection",
    ],
}

export const contextClicked = (clickData) => {
    if (clickData.menuItemId === contextMenuItem.id
        && clickData.selectionText
    ) {
        console.log("[OK] SELECTION TEXT: ", clickData.selectionText)

        const query = clickData.selectionText.trim()
                               .toLowerCase()

        console.log("[OK] QUERY: ", query)

        chrome.storage.local.set({ query }, () => {
            chrome.windows.create({
                url: "html/result.html",
                type: "popup",
                width: 640,
                height: 480,
            })

            getLemma(query)
                .then((lemma) => {
                    console.log("[OK] LEMMA: ", lemma)

                    search(lemma)
                        .then((result) => {
                            console.log("[OK] SEARCH RESULT: ", result)

                            chrome.storage.local.set({ result }, () => {
                                chrome.runtime.sendMessage({
                                    msg: "search_complete",
                                    data: {
                                        result,
                                        query,
                                    },
                                })
                            })
                        })
                        .catch(() => {
                            console.log(`[ERROR] NO SEARCH RESULTS FOR "${query}"`)

                            chrome.runtime.sendMessage({
                                msg: "error404",
                                data: {
                                    error: "Search query yielded no results!",
                                    query,
                                },
                            })
                            chrome.storage.local.set({
                                error404: true,
                                query,
                            })
                        })
                })
                .catch(() => {
                    console.log(`[ERROR] NO LEMMA FOUND FOR "${query}"`)

                    chrome.runtime.sendMessage({
                        msg: "error404",
                        data: {
                            error: "Lemma not found!",
                            query,
                        },
                    })
                    chrome.storage.local.set({
                        error404: true,
                        query,
                    })
                })
        })
    }
}

export const createContextMenu = () => {
    chrome.contextMenus.create(contextMenuItem, () => {
        console.log("created new menu")
    })
}

export default () => {
    chrome.contextMenus.onClicked.addListener((clickData) => {
        console.log("clicked ", clickData.menuItemId)
        contextClicked(clickData)
    })
}
