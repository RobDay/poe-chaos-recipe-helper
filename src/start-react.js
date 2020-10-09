const net = require('net')
const spawn = require('child_process').spawn

console.log('in start react');
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
      // const exec = childProcess.exec
      // spawn('ls', ['-lh', '/usr'])
      // const spawned = spawn('npm run electron')
      const spawned = spawn('npm', ['run', 'electron'])
      spawned.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
      });
      
      spawned.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
      });
      
      spawned.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
      });
    }
  })
}

tryConnection()

client.on('error', () => {
  setTimeout(tryConnection, 1000)
})