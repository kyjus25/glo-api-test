const config = require('./config.json');

const electron = require('electron');
// Module to control application life.
const app = electron.app
// Module to login native browser window.
const BrowserWindow = electron.BrowserWindow;


global.__basedir = __dirname;

var express = require('express');
var shell = require('electron').shell;
var bodyParser = require('body-parser');
const path = require('path');
const url = require('url');
var request = require('request');

var expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

// to serve our JavaScript, CSS and index.html
expressApp.use(express.static('./'));

expressApp.set('code', "undefined");
expressApp.set('token', "undefined");

expressApp.get('/', function (req, res) {
   console.log('CODE', req.query.code);
    console.log('STATE', req.query.state);
    if (req.query.hasOwnProperty('state') && req.query.state === config.STATE) {
        if (req.query.hasOwnProperty('code')) {
            const request_body = {
                'grant_type': 'authorization_code',
                'client_id': config.CLIENT_ID,
                'client_secret': config.CLIENT_SECRET,
                'code': req.query.code
            };

            request.post('https://api.gitkraken.com/oauth/access_token', {
                json: request_body
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    return
                }
                console.log('TOKEN', response.body.access_token);
                expressApp.set('token', response.body);
                mainWindow.setSize( 1300, 800);
                mainWindow.center();
            });
        }
    }
    res.sendFile( __basedir + '/thanks.html');
});

expressApp.get('/getUser', function (req, res) {
    request.get('https://gloapi.gitkraken.com/v1/glo/user?access_token=' + expressApp.settings.token.access_token + '&fields=created_date,email,name,username',
        (error, response, body) => {
        if (error) {
            console.error(error)
            return
        }
        res.send(body);
    });
});

expressApp.get('/getBoards', function (req, res) {
    request.get('https://gloapi.gitkraken.com/v1/glo/boards?access_token=' + expressApp.settings.token.access_token + '&fields=archived_columns,archived_date,columns,created_by,created_date,invited_members,labels,members,name',
        (error, response, body) => {
            if (error) {
                console.error(error)
                return
            }
            res.send(body);
        });
});

expressApp.get('/getCards', function (req, res) {
    request.get('https://gloapi.gitkraken.com/v1/glo/boards/' + req.query.boardId + '/cards?access_token=' + expressApp.settings.token.access_token + '&fields=archived_date,assignees,attachment_count,board_id,column_id,comment_count,completed_task_count,created_by,created_date,due_date,description,labels,name,total_task_count,updated_date',
        (error, response, body) => {
            if (error) {
                console.error(error)
                return
            }
            res.send(body);
        });
});

expressApp.get('/authenticate', function (req, res) {
    shell.openExternal('https://app.gitkraken.com/oauth/authorize?response_type=code&client_id='+ config.CLIENT_ID + '&scope=board:write board:read user:write user:read&state=' + config.STATE)
});

expressApp.get('/getToken', function (req, res) {
    res.send({token: expressApp.settings.token});
});

var port = process.env.PORT || 5000
expressApp.listen(port, () => console.log('Listening at http://localhost:5000'));






// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: 400,
      height: 280,
      center: true,
      frame: false,
      minWidth: 1300,
      minHeight: 800,
      icon: path.join(__dirname, 'assets/pngs/icon.png')
    })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    process.exit()
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to login browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-login a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
