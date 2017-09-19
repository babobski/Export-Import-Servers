(function(){
	var self = window.arguments[0],
		versionsIDE = self.versionsIDE,
		versionsEDIT = self.versionsEDIT,
		extensions = self.extensions,
		currentVersion = self.currentVersion;
	
	// Add buttons to the import screen
	function addButtons() {
		var btnWrap = document.getElementById('buttonBox');
		for (var i =  0; i < versionsIDE.length; i++) {
			var newBtn = document.createElement('button');
			newBtn.setAttribute('flex', 1);
			newBtn.setAttribute('label', 'Komodo IDE ' + versionsIDE[i].version);
			newBtn.setAttribute('data-version', versionsIDE[i].version);
			newBtn.setAttribute('data-type', versionsIDE[i].type);
			newBtn.onclick = function(){
				importServers(this);
			};
			btnWrap.appendChild(newBtn);
		}
		
		for (var x =  0; x < versionsEDIT.length; x++) {
			var newBtnEdit = document.createElement('button');
			newBtnEdit.setAttribute('flex', 1);
			newBtnEdit.setAttribute('label', 'Komodo Edit ' + versionsEDIT[x].version);
			newBtnEdit.setAttribute('data-version', versionsEDIT[x].version);
			newBtnEdit.setAttribute('data-type', versionsEDIT[x].type);
			newBtnEdit.onclick = function(){
				importServers(this);
			};
			btnWrap.appendChild(newBtnEdit);
		}
		
		// If nothing to import show message
		if (versionsIDE.length === 0 && versionsEDIT.length === 0) {
			var msg = document.createElement('description');
			msg.innerHTML = 'There is nothing to import.';
			msg.setAttribute('flex', 1);
			btnWrap.appendChild(msg);
		}
	}
	
	// Call Preform import function
	function importServers($el) {
		extensions.importServers.preformImportServers($el.getAttribute('data-version'), currentVersion, $el.getAttribute('data-type'));
	}
	
	// Load the buttons on DOM ready
	window.addEventListener('DOMContentLoaded', addButtons);
}).apply();
