
function loadButtons() {
	var addUpdateBtn = document.getElementById('buttonAdd');
	
	if (addUpdateBtn !== null) {
		var importBtn = document.createElement('button');
		var exportBtn = document.createElement('button');
		
		importBtn.setAttribute('label', 'Import Servers');
		exportBtn.setAttribute('label', 'Export Servers');
		importBtn.setAttribute('onclick', 'extensions.ExportImportServers.importFromFile(true);');
		exportBtn.setAttribute('onclick', 'extensions.ExportImportServers.exportToFile(true);');
		
		addUpdateBtn.parentNode.insertBefore(importBtn, addUpdateBtn);
		addUpdateBtn.parentNode.insertBefore(exportBtn, addUpdateBtn);
	}
}


window.addEventListener('DOMContentLoaded', loadButtons);
