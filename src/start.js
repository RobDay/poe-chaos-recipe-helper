const { app, BrowserWindow, session } = require('electron')
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const path = require('path')
const url = require('url')

let mainWindow;




function createWindow() {
  const cookie = { url: 'https://www.pathofexile.com', name: 'POESESSID', value: '***REMOVED***' }
session.defaultSession.cookies.set(cookie)
  mainWindow = new BrowserWindow({
    width: 468,
    height: 600,
    transparent: true,
    frame: false,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
  })


  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../public/index.html'),
        protocol: 'file:',
        slashes: true,
        
      })
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

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