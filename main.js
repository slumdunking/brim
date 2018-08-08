import {enableLiveReload} from "electron-compile"
const {app, BrowserWindow} = require("electron")

enableLiveReload()

let win

const createWindow = () => {
  enableLiveReload()
  win = new BrowserWindow({
    width: 1000,
    height: 1200,
    backgroundColor: "#ffffff"
  })
  win.loadFile("index.html")
  win.setMenu(null)
  win.on("closed", () => {
    win = null
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (win === null) {
    createWindow()
  }
})