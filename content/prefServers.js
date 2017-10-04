
function loadButtons() {
	var addUpdateBtn = document.getElementById('buttonAdd');
	var serverSelect = document.getElementById('serversPopup');
	
	if (addUpdateBtn !== null) {
		var importBtn = document.createElement('button');
		
		importBtn.setAttribute('label', 'Import');
		importBtn.setAttribute('onclick', 'extensions.ExportImportServers.importFromFile(true);');
		
		addUpdateBtn.parentNode.insertBefore(importBtn, addUpdateBtn);
		console.log(serverSelect);
		console.log(serverSelect.childElementCount);
		if (serverSelect.childElementCount > 0) {
			var exportBtn = document.createElement('button');
			console.log('in here');
			exportBtn.setAttribute('label', 'Export');
			exportBtn.setAttribute('onclick', 'extensions.ExportImportServers.exportToFile(true);');
			
			addUpdateBtn.parentNode.insertBefore(exportBtn, importBtn);
		}
	}
}


window.addEventListener('load', loadButtons);
