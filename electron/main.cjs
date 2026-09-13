const {app, BrowserWindow, ipcMain, BrowserView} = require("electron")

const createWindow = ()=>{
    const win = new BrowserWindow({
        width: 800,
        height: 500,
        // resizable: false,
        maximizable:false,
        fullscreenable: false,
        minimizable:false,
        transparent: false,

        webPreferences:{
          contextIsolation:true
        }
    })

    win.loadURL("http://localhost:5173")
}

app.whenReady().then(()=>{
    createWindow()

     app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})