const {app, BrowserWindow, ipcMain, BrowserView} = require("electron")
const {useState} = require('react')
const path = require('path')


let win
  
const createWindow = ()=>{
    win = new BrowserWindow({
        width: 370,
        height: 625,
        // resizable: false,
        fullscreenable: false,
        // minimizable:false,
        transparent: true ,
        frame: false,
        webPreferences:{
          preload: path.join(__dirname, 'preload.cjs'),
          contextIsolation:true,
          nodeIntegration: false
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

// exits the browser
ipcMain.on('app:quit', ()=>{
  app.quit()
})
ipcMain.on('app:minimize',()=>{
  if(win.isMinimizable()){
      win.minimize()
  }

})
ipcMain.on('app:minMax', ()=>{
 if (win.isMaximized()){
  win.unmaximize()
 }else{
  win.maximize()
 }
})
