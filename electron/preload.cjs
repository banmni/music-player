const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  exit: ()=>ipcRenderer.send("app:quit"),
  minimize : () => ipcRenderer.send("app:minimize"),
  minMax:()=>ipcRenderer.send("app:minMax")
})

