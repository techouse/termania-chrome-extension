import install                        from "@/install"
import context, { createContextMenu } from "@/context"
import { getDictionaries }            from "@/services"

/**
 * Install the database if needed
 */
chrome.runtime.onInstalled.addListener(() => {
    getDictionaries()
    install()
    createContextMenu()
})

/**
 * Add the context menu
 */
context()
