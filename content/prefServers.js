
function loadButtons() {
	var addUpdateBtn = document.getElementById('buttonAdd');
	var serverSelect = document.getElementById('serversList');
	
	if (addUpdateBtn !== null) {
		var importBtn = document.createElement('button');
		
		importBtn.setAttribute('label', 'Import');
		importBtn.setAttribute('onclick', 'extensions.ExportImportServers.importFromFile(true);');
		
		addUpdateBtn.parentNode.insertBefore(importBtn, addUpdateBtn);
		
		if (serverSelect.itemCount > 0) {
			var exportBtn = document.createElement('button');
			
			exportBtn.setAttribute('label', 'Export');
			exportBtn.setAttribute('onclick', 'extensions.ExportImportServers.exportToFile(true);');
			
			addUpdateBtn.parentNode.insertBefore(exportBtn, addUpdateBtn);
		}
	}
}


window.addEventListener('DOMContentLoaded', loadButtons);
