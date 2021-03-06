// electron/electron.js
const path = require('path');
const { ipcMain, app, BrowserWindow, dialog } = require('electron');
const { default: installExtension, VUEJS3_DEVTOOLS } = require('electron-devtools-installer');
const isDev = process.env.IS_DEV == "true" ? true : false;
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


// Global Callback
let callbackForBluetoothEvent;

const getFileFromUser = () => {
  const files = dialog.showOpenDialog(win, {
    properties: ['openFile']
  }).then(result => {
    console.log(result.canceled)
    console.log(result.filePaths)

    const content = JSON.parse(fs.readFileSync(result.filePaths[0]));

    win.webContents.send(
      "fileContents",
      content
    );

    console.log(content);
  });
};

const saveFile = (data) => {
  let options = {
    title: "Save VO File",
    buttonLabel : "Save",
    filters :[
      {name: 'Custom File Type', extensions: ['vo']},
     ]
  }
  console.log("test")
  dialog.showSaveDialog(win, options).then(result => {
    if (!result.canceled)
    {
      console.log(result.filePath)
      fs.writeFile(result.filePath, data, (err) => {
        if (err) throw err
        console.log("file Saved")
      })
    }
  }
  ).catch((error) => {
    console.log(error)
  })
};

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false //Work out how to use context isolation at some point....
    },
  });

  win.webContents.on(
    "select-bluetooth-device",
    (event, deviceList, callback) => {
      event.preventDefault(); //important, otherwise first available device will be selected
      console.log(deviceList); //if you want to see the devices in the shell
      let bluetoothDeviceList = deviceList;
      callbackForBluetoothEvent = callback; //to make it accessible outside createWindow()

      win.webContents.send(
        "channelForBluetoothDeviceList",
        bluetoothDeviceList
      );
    }
  );

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
}


// Cancels Discovery
ipcMain.on("channelForTerminationSignal", _ => {
  callbackForBluetoothEvent(""); //reference to callback of win.webContents.on('select-bluetooth-device'...)
  console.log("Discovery cancelled");
});

// Callback to select Device
ipcMain.on("channelForSelectingDevice", (event, DeviceId) => {
  callbackForBluetoothEvent(DeviceId); //reference to callback of win.webContents.on('select-bluetooth-device'...)
  console.log("Device selected, discovery finished");
});

//Callback for Dialog box
ipcMain.on("loadFile", (event, DeviceId) => {
  getFileFromUser()
  console.log("Device selected, discovery finished");
});

ipcMain.on("saveFile", (event, data) => {
  saveFile(data)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension(VUEJS3_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});