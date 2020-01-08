/**
 * Install the database if needed
 */
chrome.runtime.onInstalled.addListener(() => {
    import(/* webpackChunkName: "services" */ "@/services").then(({ getDictionaries }) => {
        getDictionaries()
    })

    import(/* webpackChunkName: "install" */ "@/install").then(({ default: install }) => {
        install()
    })

    import(/* webpackChunkName: "context" */ "@/context").then(({ createContextMenu }) => {
        createContextMenu()
    })
})

/**
 * Add the context menu
 */
import(/* webpackChunkName: "context" */ "@/context").then(({ default: context }) => {
    context()
})
