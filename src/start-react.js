const net = require('net')
const childProcess = require('child_process')

const port = process.env.PORT ? process.env.PORT - 100 : 3000

process.env.ELECTRON_MAIN_START_URL = `http://localhost:${port}/?mainWindow`
process.env.ELECTRON_OVERLAY_START_URL = `http://localhost:${port}/?overlay`

const client = new net.Socket()

let startedElectron = false
const tryConnection = () => {
  client.connect({ port }, () => {
    client.end()
    if (!startedElectron) {
      console.log('starting electron')
      startedElectron = true
      const exec = childProcess.exec
      exec('npm run electron')
    }
  })
}

tryConnection()

client.on('error', () => {
  setTimeout(tryConnection, 1000)
})