import { app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
//主窗口
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 540,
    useContentSize: false,
    width: 960,
    minHeight: 540,
    minWidth: 960,
    frame: false,
    webPreferences: {
      webviewTag: true
    }
    
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

 // mainWindow.webContents.openDevTools()
}
//子窗口
let miniWindow
function createMiniWindow() {
  Menu.setApplicationMenu(null)  //关闭子窗口菜单栏
  const modalPath = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/miniWindow`
    : `file://${__dirname}/index.html#miniWindow`
  //使用hash跳转子页面
  miniWindow = new BrowserWindow({
    width: 300,
    height: 500,
    webPreferences: {
      webSecurity: false
    },
    parent: mainWindow   //主窗口
  })

  miniWindow.loadURL(modalPath)

  miniWindow.on('closed', () => miniWindow = null)
}

//开启子窗口
ipcMain.on('open-mini', () => createMiniWindow());


//最小化
ipcMain.on('window-min', () => mainWindow.minimize())
//最大化
ipcMain.on('window-max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
})
//关闭窗口
ipcMain.on('window-close', () => mainWindow.close())

//messageBox
ipcMain.on('info-box', () => {
  dialog.showMessageBox({
    type: 'info',
    title: '关于',
    message: 'Desktop Blog',
    detail: 'version:1.2.1 Beta\nAuthor: Daniel Zhang\nPowered by Chromium'
  })
})


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
