i = 1;
update = setInterval (function() {
	//update
	search = document.getElementById('apply-filter');
	search.click();
	table = document.getElementById('tblNewsList');
	state = document.getElementsByClassName('status');
	action = document.getElementsByClassName('action');
	lock = document.getElementsByClassName('locked');
	news_locked = document.getElementsByClassName('news-lock');
	state_test = document.getElementsByClassName('news-status att');
	table_test = table.rows[i].lastElementChild.className === "dataTables_empty";
	//dependency
	if (!table_test){
		table_state_test = table.rows[i].cells[4].lastElementChild.className === "news-status att";
		lock_test = table.rows[i].cells[3].innerText === "";
	}
	//news validation
	if (!table_test && state_test.length > 0) {
		console.log("Yellow New!");
		clearInterval(update);
		for (i = 1; i <= table.rows.length-1; i++) {
			if (table_state_test && lock_test) {
				console.log("Name: "+table.rows[i].cells[1].innerText);
				string = table.rows[i].cells[5].innerHTML;
				valid_new = ipcRenderer.sendSync('validation_channel', string);
				console.log(valid_new);
				while (valid_new){
					ipcRenderer.send('webview_ipc');
					table.rows[i].cells[5].lastElementChild.click();
				}
				else if (!valid_new) {
					ipcRenderer.send('continue_injection');
				}
			}
		}
	}
}, 3000);