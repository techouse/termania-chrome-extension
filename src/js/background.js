import install, { isInstalled }       from "@/install"
import context, { createContextMenu } from "@/context"

/**
 * If the database is imported add the context menu to Chrome
 */
isInstalled()
    .then(() => {
        context()
    })
    .catch((error) => {
        console.log(error)
    })

/**
 * Install the database if needed
 */
chrome.runtime.onInstalled.addListener(() => {
    install()
    createContextMenu()
})
