import { app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
//const autoUpdater = require('electron-updater').autoUpdater
import { autoUpdater } from 'electron-updater'

const feedUrl = 'http://cloud.wydxsdac.top:8088/download/latest/'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, webContents
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

  webContents = mainWindow.webContents

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  //mainWindow.webContents.openDevTools()
}
//子窗口
let miniWindow
function createMiniWindow() {
  Menu.setApplicationMenu(null)  //关闭子窗口菜单栏
  const modalPath = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/add`
    : `file://${__dirname}/index.html#add`
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
    detail: 'version:2.1.3 \nAuthor: Daniel Zhang\nPowered by Chromium'
  })
})

//监听自动更新
ipcMain.on('upDate', (e, arg) => {
  console.log('update')
  checkForUpdates()
 
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
 */


let checkForUpdates = () => {
  //服务武器地址
  autoUpdater.setFeedURL(feedUrl)

  //自动更新生命周期
  autoUpdater.on('error', function(message) {
    sendUpdateMessage('error', message)
  })

  autoUpdater.on('checking-for-update', function(message) {
    sendUpdateMessage('checking-for-update', message)
  })

  autoUpdater.on('update-available', function(message) {
    sendUpdateMessage('update-available', message)
  })

  autoUpdater.on('update-not-available', function(message) {
    sendUpdateMessage('update-not-available', message)
  })
// 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    sendUpdateMessage('downloadProgress', progressObj)
  })

  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    sendUpdateMessage('isUpdateNow',releaseName)
    ipcMain.on('updateNow', (e, arg) => {
        autoUpdater.quitAndInstall()
    })
  })
  //执行自动更新检查
  autoUpdater.checkForUpdates()

}

function sendUpdateMessage(message, data) {
  console.log({ message, data })
  webContents.send('message', { message, data })
}

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })



