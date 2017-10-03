/**
 * Select end process servers to import or export
 */
var self 		= window.arguments[0],
	extensions 	= self.extensions,
	type 		= self.type,
	servers 	= self.servers,
	skip 		= self.skip;
	
function buildList() {
	var list = document.getElementById('serverList');
		list.innerHTML = '';
		
	if (type === 'import') {
		var existColl 	= document.createElement('treecol'),
			colls 		= document.getElementById('serverColls');
		
		existColl.setAttribute('flex', '1');
		existColl.setAttribute('label', 'Already Exist');
		
		colls.appendChild(existColl);
	}
	
	for (var i = 0; i < servers.length; i++) {
		var newItem 	= document.createElement('treeitem'),
			treerow 	= document.createElement('treerow'),
			selectCell 	= document.createElement('treecell');
		
		newItem.setAttribute('data-passive', servers[i].passive);
		newItem.setAttribute('data-password', servers[i].password);
		newItem.setAttribute('data-path', servers[i].path);
		newItem.setAttribute('data-port', servers[i].port);
		newItem.setAttribute('data-privatekey', servers[i].privatekey);
		
		selectCell.setAttribute('value', (skip.indexOf(servers[i].alias) == -1));
		
		var aliasCell 		= document.createElement('treecell'),
			hostnameCell 	= document.createElement('treecell'),
			usernameCell 	= document.createElement('treecell'),
			protocolCell 	= document.createElement('treecell');
		
		if (skip.indexOf(servers[i].alias) !== -1) {
			selectCell.setAttribute('editable', 'false');
			selectCell.setAttribute('tooltip', 'serverExist');
			aliasCell.setAttribute('editable', 'false');
		} else {
			selectCell.setAttribute('editable', 'true');
			aliasCell.setAttribute('editable', 'true');
		}
		
		aliasCell.setAttribute('label', servers[i].alias);
		hostnameCell.setAttribute('label', servers[i].hostname);
		hostnameCell.setAttribute('editable', 'false');
		usernameCell.setAttribute('label', servers[i].username);
		usernameCell.setAttribute('editable', 'false');
		protocolCell.setAttribute('label', servers[i].protocol);
		protocolCell.setAttribute('editable', 'false');
		
		treerow.appendChild(selectCell);
		treerow.appendChild(aliasCell);
		treerow.appendChild(hostnameCell);
		treerow.appendChild(usernameCell);
		treerow.appendChild(protocolCell);
		
		if (type === 'import') {
			var existCell = document.createElement('treecell');
			
			existCell.setAttribute('label', (skip.indexOf(servers[i].alias) !== -1 ? 'true' : 'false'));
			treerow.appendChild(existCell);
		}
		
		newItem.appendChild(treerow);
		list.appendChild(newItem);
	}
}

function buildView() {
	var hideBtn;
	if (type === 'import') {
		hideBtn = document.getElementById('exportServers');
		document.title = 'Select servers to import';
	} else {
		hideBtn = document.getElementById('importServer');
		document.title = 'Select servers to export';
	}
	hideBtn.style.display = 'none';
	
	// Build tree list
	buildList();
}

function preformImport() {
	serversToImport = getServerList();
	if (serversToImport.length > 0) {
		extensions.ExportImportServers._importFromFile(serversToImport);
		return false;
	}
	extensions.ExportImportServers._closeScreen('selectServers');
	extensions.ExportImportServers.showNotification('error', 'Nothing to import.');
}

function preformExport() {
	serversToImport = getServerList();
	console.log(serversToImport);
	if (serversToImport.length > 0) {
		extensions.ExportImportServers._exportToFile(serversToImport);
		return false;
	}
	extensions.ExportImportServers._closeScreen('selectServers');
	extensions.ExportImportServers.showNotification('error', 'Nothing to export.');
}

function getServerList() {
	var list 		= document.getElementById('serverList');
	var listItems 	= list.children;
	var outpuList 	= [];
	
	for (var i = 0; i < listItems.length; i++) {
		var row 		= listItems[i].children[0];
		var cells 		= row.children;
		var serverInfo 	= {};
		
		serverInfo.passive 		= listItems[i].getAttribute('data-passive');
		serverInfo.password 	= listItems[i].getAttribute('data-password');
		serverInfo.path 		= listItems[i].getAttribute('data-path');
		serverInfo.port 		= listItems[i].getAttribute('data-port');
		serverInfo.privatekey 	= listItems[i].getAttribute('data-passive');
		
		for (var e = 0; e < cells.length; e++) {
			switch (e) {
				case 0:
					serverInfo.checked = cells[e].getAttribute('value');
					break;
				case 1:
					serverInfo.alias = cells[e].getAttribute('label');
					break;
				case 2:
					serverInfo.hostname = cells[e].getAttribute('label');
					break;
				case 3:
					serverInfo.username = cells[e].getAttribute('label');
					break;
				case 4:
					serverInfo.protocol = cells[e].getAttribute('label');
					break;
			}
		}
		outpuList.push(serverInfo);
	}
	return outpuList;
}

window.addEventListener('DOMContentLoaded', buildView);
