const { app, BrowserWindow, session } = require('electron')
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const path = require('path')
const url = require('url')

let mainWindow;
let window2;




function createWindow() {
  const cookie = { url: 'http://www.yahoo.com', name: 'POESESSID', value: '***REMOVED***' }
  const cookie2 = { url: 'https://www.pathofexile.com', name: 'POESESSID', value: '***REMOVED***' }
session.defaultSession.cookies.set(cookie)
session.defaultSession.cookies.set(cookie2)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // transparent: true,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
  })

  // window2 = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   x: 100,
  //   y: 100,
  //   // transparent: true,
  //   // alwaysOnTop: true,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     webSecurity: false
  //   },
  // })
  // mainWindow.setIgnoreMouseEvents(true);

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../public/index.html'),
        protocol: 'file:',
        slashes: true,
        
      })
  )

  // window2.loadURL(
  //   process.env.ELECTRON_START_URL ||
  //     url.format({
  //       pathname: path.join(__dirname, '/../public/index.html'),
  //       protocol: 'file:',
  //       slashes: true,
  //     })
  // )

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

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