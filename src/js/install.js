import { importDB } from "dexie-export-import"
import JSZip        from "jszip"
import db           from "@/services/db"

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
            fetch(chrome.runtime.getURL("data/db.zip"))
                .then((response) => response.blob())
                .then((zipBlob) => db.delete()
                                     .then(() => JSZip.loadAsync(zipBlob)
                                                      .then((zip) => zip.file("db.json")
                                                                        .async("blob"))
                                                      .then((blob) => importDB(blob, {
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
                                                          })))
                                     .catch((error) => {
                                         console.error(error)
                                     }))
                .then(() => {
                    /**
                     * Open the database and add the context to Chrome once done
                     */
                    db.open()
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    })
    db.open()
}

export default install
