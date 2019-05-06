console.log("renderer.js OK");
const blast_news_url = "https://blaster.blastingnews.com/news/test_list/"

//Imports
const {ipcRenderer} = require('electron')
const {shell} = require('electron')

//Selectors
webview = document.querySelector('webview')

//Events
webview.addEventListener('dom-ready', () => {
	//webview.openDevTools()	
	webview.executeJavaScript(`
		const {ipcRenderer} = require('electron')
		const {shell} = require('electron')
	`)
})

ipcRenderer.on('display_notification', () => {
	Notification.requestPermission().then(function (result){
		var myNotification = new Notification('bruteUx', {
    	body: 'Nova noticia!',
  		})
	})	
})


ipcRenderer.on('menu_blasting_home', () => {
	console.log("menu_blasting_home listening")
	location.href="./blast.html" 
});

ipcRenderer.on('menu_blasting_stop', () => {
	console.log("menu_blasting_stop listening")
	webview.executeJavaScript(`clearInterval(update)`) 
});

ipcRenderer.on('menu_blasting_start', () => {
	console.log("menu_blasting_start listening")
	if (webview.getURL() === blast_news_url) 
		webview.executeJavaScript(`
			document.getElementById('selNewsOwner').value = "uall"
			update = setInterval (function() {
				search = document.getElementById('apply-filter')
			search.click()
			table = document.getElementById('tblNewsList')
			state = document.getElementsByClassName('status')
			action = document.getElementsByClassName('action')
			lock = document.getElementsByClassName('locked')
			news_locked = document.getElementsByClassName('news-lock')
			state_test = document.getElementsByClassName('news-status att')
			table_test = table.rows[1].lastElementChild.className === "dataTables_empty"
			if (!table_test && state_test.length > 0){
				console.log("Yellow New!")
				ipcRenderer.send('found_new')
			}
		},350);
	`);
	else {
		alert("Wops! Não estamos no link correto!")
	}	
})

ipcRenderer.on('found_new', () => {
	console.log("found_new listening")
	webview.executeJavaScript(`
		for (var i = 1; i < table.rows.length; i++){
			lock_test = table.rows[i].cells[3].lastElementChild === null
			table_state_test = table.rows[i].cells[4].lastElementChild.className === "news-status att"
			if (table_state_test && lock_test){
				autor = table.rows[i].cells[2].innerText
				string = table.rows[i].cells[5].innerHTML
				console.log("Name: "+table.rows[i].cells[1].innerText)
				console.log("News unlocked? "+lock_test)
				console.log("Valid news status? "+table_state_test)
				console.log("Table index:"+i)
				console.log("Click the "+i+"º "+"index");
				console.log(autor)
				valid_new = ipcRenderer.sendSync('validation_channel', string)
				if (valid_new){
					ipcRenderer.send('notification_channel')
				}
			}
		}
	`)
})