const {app, BrowserWindow, Menu, MenuItem} = require('electron');
const path = require('node:path');

const isMac = process.platform === 'darwin'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}
const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: false,
		roundedCorners: true,
		center: true,
		hasShadow: true,
		icon: path.join(__dirname, './src/fav.png'),
		webPreferences: {
			preload: path.join(__dirname, './preload.js'),
			nodeIntegration: true
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, './src/index.html'));

	const ctxMenu = new Menu();

	ctxMenu.append(new MenuItem({role: 'copy'}))
	ctxMenu.append(new MenuItem({role: 'paste'}))

	mainWindow.webContents.on('context-menu', function (e, params) {
		ctxMenu.popup(	{
			y: params.y,
			x: params.x
		})
	})

	if (process.env.NODE_ENV)
		mainWindow.webContents.openDevTools();

	Menu.setApplicationMenu(Menu.buildFromTemplate([
		{
			label: 'window',
			submenu: [
				{role: 'toggleDevTools'},
				{role: 'reload'},
				isMac ? {role: 'close'} : {role: 'quit'},
			]
		}

	]));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
