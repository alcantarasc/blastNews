console.log("menu.js ok");
const {ipcRenderer} = require('electron');

//Events
ipcRenderer.on('menu_blasting_home', () => {
	console.log("menu_blasting_home listening");
	location.href="blast.html"; 
});

ipcRenderer.on('menu_blasting_start', () => {
	alert("Wops! Não estamos no site do blast...");
})