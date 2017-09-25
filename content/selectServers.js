(function(){
	var self = window.arguments[0],
		extensions = self.extensions,
		type = self.type,
		servers = self.servers;
		
	function buildList() {
		var list = document.getElementById('serverList');
		
		for (var i = 0; i < servers.length; i++) {
			var newItem = document.createElement('treeitem');
			var treerow = document.createElement('treerow');
			var selectCell = document.createElement('treecell');
			
			selectCell.setAttribute('class', 'selected');
			selectCell.setAttribute('value', 'true');
			
			var aliasCell = document.createElement('treecell');
			var hostnameCell = document.createElement('treecell');
			var usernameCell = document.createElement('treecell');
			var protocolCell = document.createElement('treecell');
			
			aliasCell.setAttribute('label', servers[i].alias);
			hostnameCell.setAttribute('label', servers[i].hostname);
			usernameCell.setAttribute('label', servers[i].username);
			protocolCell.setAttribute('label', servers[i].protocol);
			
			treerow.appendChild(selectCell);
			treerow.appendChild(aliasCell);
			treerow.appendChild(hostnameCell);
			treerow.appendChild(usernameCell);
			treerow.appendChild(protocolCell);
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
	
	window.addEventListener('DOMContentLoaded', buildView);
	
}).apply();
