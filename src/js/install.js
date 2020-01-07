import { importDB } from "dexie-export-import"
import db           from "@/services/db"
import context      from "@/context"

const install = () => {
    /**
     * Populate the IndexedDB database with lemmas from Sloleks
     */
    db.on("populate", () => {
        /**
         * Create a notification about the installation
         */
        chrome.notifications.create({
            type: "progress",
            iconUrl: "images/48.png",
            title: "Installing Termania extension",
            message: "Importing Sloleks database",
            progress: 0,
        }, (notificationId) => {
            fetch(chrome.runtime.getURL("data/db.json"))
                .then((response) => response.blob())
                .then((blob) => db.delete()
                                  .then(() => importDB(blob, {
                                      progressCallback: ({ totalRows, completedRows }) => {
                                          const progress = totalRows > 0 ? Math.round((completedRows / totalRows) * 100) : 0

                                          if (progress <= 100) {
                                              chrome.notifications.update(notificationId, { progress })
                                          } else {
                                              chrome.notifications.clear(notificationId)
                                          }

                                          console.log(`Importing database ${progress}% complete`)
                                      },
                                  })
                                      .then((ImportedDB) => {
                                          /**
                                           * Notify the user via a notification
                                           */
                                          chrome.notifications.create({
                                              type: "basic",
                                              iconUrl: "images/48.png",
                                              title: "Installing Termania complete",
                                              message: "Importing Sloleks database 100% complete. You may now use the extension",
                                          })
                                          return ImportedDB
                                      }))
                                  .catch((error) => {
                                      console.error(error)
                                  }))
                .then(() => {
                    /**
                     * Open the database and add the context to Chrome once done
                     */
                    db.open()
                      .then(() => context())
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    })
    db.open()
}

export default install
