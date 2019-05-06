//Imports
const electron = require('electron')
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron');
const {shell} = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu
let mainWindow
var news_id = []


function createWindow (){
  // Create the browser window.
  mainWindow = new BrowserWindow({center: true})
  mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './html/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  // Open the DevTools.
  //	mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
    createWindow();
    const template = [
        {
            label: 'Blasting',
            submenu: [
                {label: 'home',accelerator: 'CmdOrCtrl+H', click: function(){mainWindow.webContents.send('menu_blasting_home')}},
                {label: 'start', accelerator: 'CmdOrCtrl+W' ,click: function(){mainWindow.webContents.send('menu_blasting_start')}},
                {label: 'stop', accelerator: 'CmdOrCtrl+S' ,click: function(){mainWindow.webContents.send('menu_blasting_stop')}},
            ]
        }
    ]
   const menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu)
})


// Quit when all windows are closed.
app.on('window-all-closed', function (){
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function (){
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

ipcMain.on('notification_channel', () => {
  console.log("main.js listening");
  mainWindow.webContents.send('display_notification')
  shell.beep()
});

ipcMain.on('validation_channel', (event, arg) => {
    var rx_news_id = /(?:data-news-id=")(\d+)(?:")/
    var id = rx_news_id.exec(arg)
    var value = true

    for (var i = 0; i < news_id.length; i++){
      if (news_id[i] === id[1]){
        value = false
        i = news_id.length
      }
    }
    if (value){
      console.log('String: '+arg)
      console.log("Array before: "+news_id);
      console.log(id[1]);
      open_news(id[1])
      news_id.push(id[1]);
      console.log("Array now: "+news_id)
    }
    event.returnValue = value
});

function open_news (id){
  const blast_edit_url = 'https://blast.blastingnews.com/news/edit/'
  mainWindow.webContents.send('menu_blasting_stop') 
  shell.openExternal(blast_edit_url+id)
  console.log(blast_edit_url+id)
}

ipcMain.on('continue_injection', () => {
  mainWindow.webContents.send('menu_blasting_start');
  console.log("continuing injection");
})

ipcMain.on('found_new', ()=> {
  mainWindow.webContents.send('found_new');
})
