const {
  app,
  Tray,
  Menu,
  BrowserWindow
} = require('electron');
const path = require('path');
const iconPath = path.join(__dirname, 'app/assets/icons/resized.png');
let appIcon = null;
let win = null;
const {
  getProfiles,
  removeProfile,
  changeProfile,
  prepareFileSystem
} = require('./app/js/utils/helpers');
const winURL = `file://${__dirname}/app/index.html`;

prepareFileSystem();

app.on('ready', () => {
  win = new BrowserWindow({
    show: false,
    // backgroundColor: '#2F384B',
    fullscreenable: false,
    frame: true,
    resizable: false,
    useContentSize: true,
    width: 520,
    height: 820
  });
  win.loadURL(winURL)

  appIcon = new Tray(iconPath);
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(
      [{
          label: "Application",
          submenu: [{
              label: "About Lemonade",
              selector: "orderFrontStandardAboutPanel:"
            },
            {
              type: "separator"
            },
            {
              label: "Quit",
              accelerator: "Command+Q",
              click: function () {
                app.quit();
              }
            }
          ]
        },
        {
          label: "Edit",
          submenu: [{
              label: "Undo",
              accelerator: "CmdOrCtrl+Z",
              selector: "undo:"
            },
            {
              label: "Redo",
              accelerator: "Shift+CmdOrCtrl+Z",
              selector: "redo:"
            },
            {
              type: "separator"
            },
            {
              label: "Cut",
              accelerator: "CmdOrCtrl+X",
              selector: "cut:"
            },
            {
              label: "Copy",
              accelerator: "CmdOrCtrl+C",
              selector: "copy:"
            },
            {
              label: "Paste",
              accelerator: "CmdOrCtrl+V",
              selector: "paste:"
            },
            {
              label: "Select All",
              accelerator: "CmdOrCtrl+A",
              selector: "selectAll:"
            }
          ]
        }
      ]
    )
  )
  var contextMenu = Menu.buildFromTemplate(
    [{
        label: 'Open Lemonade',
        click: () => {
          win.show();
        }
      },
      {
        label: 'Profiles',
        submenu: [{
          label: 'offline',
          type: 'radio',
          checked: true,
          click: () => {
            removeProfile((err, success) => {
              if (err) {
                win.show();
              }
            });
          }
        }].concat(
          (getProfiles() || []).map(p => ({
            label: p.name,
            type: 'radio',
            checked: p.active,
            click: () => {
              changeProfile(p.name, (err, success) => {
                if (err) {
                  win.show();
                }
              });
            }
          })))
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:',
      }
    ]);
  appIcon.setToolTip('App for Authentication against AWS.');
  appIcon.setContextMenu(contextMenu);

});