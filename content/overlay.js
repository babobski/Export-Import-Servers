/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.ExportImportServers) === 'undefined') extensions.ExportImportServers = {
	version: '1.1.0'
};

if (!('extensions' in ko)) ko.extensions = {};

// Load KoHelper
xtk.load('chrome://ExportImportServers/content/koHelper.js');

(function() {
	var self 		= this,
		RCService 	= Components.classes["@activestate.com/koRemoteConnectionService;1"].
                    getService(Components.interfaces.koIRemoteConnectionService);
	
	this.exportToFile = function(closePrefScreen = false) {
		var server_count 		= {},
			servers 			= RCService.getServerInfoList(server_count),
			processedServers 	= self._procesServerSettings(servers);
		
		if (processedServers.length > 0) {
			self._preformActualExportOrImportToFile('export', processedServers);
			if (closePrefScreen) {
				self._closePrefScreen();
			}
			return false;
		}
		self.showNotification('error', 'Nothing to export.');
		if (closePrefScreen) {
			self._closePrefScreen();
		}
	};
	
	this.importFromFile = function(closePrefScreen = false) {
			
		var server_count 		= {},
			servers 			= RCService.getServerInfoList(server_count),
			processedServers 	= self._procesServerSettings(servers),
			importFile 			= ko.filepicker.browseForFile(),
			ipmortServers 		= [],
			skip				= [];
		
		if (importFile !== null) {
			
			
			var serversToImport = koXI.readObj(importFile);
			if (serversToImport.length > 0) {
				for (var i = 0; i < serversToImport.length; i++) {
					var serverToImport 	= serversToImport[i],
						serverInfo 		= Components.classes["@activestate.com/koServerInfo;1"].
						createInstance(Components.interfaces.koIServerInfo);
					
					serverInfo.init(null, serverToImport.protocol, serverToImport.alias, serverToImport.hostname, serverToImport.port, serverToImport.username, serverToImport.password, serverToImport.path, serverToImport.passive, serverToImport.privatekey);
					ipmortServers.push(serverInfo);
					
					if (self._inServerList(processedServers, serverToImport)) {
						skip.push(serverToImport.alias);
					}
				}
				if (skip.length === serversToImport.length) {
					self.showNotification('error', 'Nothing to import, all servers already exist.');
					if (closePrefScreen) {
						self._closePrefScreen();
					}
					return false;
				} 
				self._preformActualExportOrImportToFile('import', ipmortServers, skip);
				if (closePrefScreen) {
					self._closePrefScreen();
				}
			}
		}
	};
	
	this._preformActualExportOrImportToFile = function(type, servers, skip = []) {
		
		if (servers.length > 0) {
			var features = "chrome,titlebar,toolbar,centerscreen,resizable,modal",
				windowVars = {
				extensions: extensions,
				servers: servers,
				type: type,
				skip: skip,
			};
			window.openDialog('chrome://ExportImportServers/content/selectServers.xul', "selectServers", features, windowVars);
		}
		
	};
	
	this._exportToFile = function(servers) {
		if (servers.length > 0) {
			var serversToExport = [];
			for (var i = 0; i < servers.length; i++) {
				var serverToExport = servers[i];
				if (serverToExport.checked === 'true') {
					serversToExport.push(serverToExport);
				}
			}
			// Ask for loacation to store the file
			var fakeEl = document.createElement('textbox');
			ko.filepicker.browseForDir(fakeEl);
			
			var fileLocation = fakeEl.value;
			if (fileLocation.length > 0) {
				var fileContent = self._procesServerSettings(serversToExport);
				koXI.storeObj(fileLocation, 'serverSettings.conf', fileContent); // TODO check if file exists
			} else {
				// No file location is selected
			}
		} else {
			// No servers to export
		}
	};
	
	this._importFromFile = function(serversToImport) {
		var RCService 			= Components.classes["@activestate.com/koRemoteConnectionService;1"].
								getService(Components.interfaces.koIRemoteConnectionService),
			server_count 		= {},
			servers 			= RCService.getServerInfoList(server_count),
			imported			= 0;
		
		
		if (serversToImport.length > 0) {
			for (var i = 0; i < serversToImport.length; i++) {
				var serverToImport 	= serversToImport[i],
					serverInfo 		= Components.classes["@activestate.com/koServerInfo;1"].
					createInstance(Components.interfaces.koIServerInfo);
				if (serverToImport.checked === 'true') {
					serverInfo.init(null, serverToImport.protocol, serverToImport.alias, serverToImport.hostname, serverToImport.port, serverToImport.username, serverToImport.password, serverToImport.path, serverToImport.passive, serverToImport.privatekey);
					servers.push(serverInfo);
					imported++;
				}
			}
			
			if (imported > 0) {
				RCService.saveServerInfoList(servers.length, servers);
				self._closeScreen('selectServers');
				self.showNotification('success', 'Successfully imported ' + imported + (imported > 1 ? ' servers.' : ' server.'));
			} else {
				self._closeScreen('selectServers');
				self.showNotification('error', 'Nothing to import.');
			}
		}
	};
	
	this._procesServerSettings = function(serverList) {
		var output = [];
		for (var i = 0; i < serverList.length; i++) {
			var server 				= serverList[i],
				newConfiguration 	= {};
			
			newConfiguration.alias 		= server.alias;
			newConfiguration.hostname 	= server.hostname;
			newConfiguration.passive	= server.passive;
			newConfiguration.password	= server.password;
			newConfiguration.path		= server.path;
			newConfiguration.port		= server.port;
			newConfiguration.privatekey	= server.privatekey;
			newConfiguration.protocol	= server.protocol;
			newConfiguration.username	= server.username;
			
			output.push(newConfiguration);
		}
		return output;
	};
	
	this._inServerList = function(serverList, server) {
		var exist = false;
		for (var i = 0; i < serverList.length; i++) {
			var installedServer = serverList[i];

			if (installedServer.alias === server.alias) {
				exist = true;
			}
			if (installedServer.hostname === server.hostname && installedServer.username === server.username) {
				exist = true;
			}
		}

		return exist;
	};
	
	this._closeScreen = function(windowName) {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher)
			.getWindowEnumerator(),
			index = 1;
			
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			if (win.name == windowName) {
				win.close();
				return;
			}
			index++;
		}
	};
	
	this._closePrefScreen = function() {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher)
			.getWindowEnumerator(),
			index = 1;
			
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			if (win.document !== null && win.document.title === 'Preferences') {
				win.close();
				return;
			}
			index++;
		}
	};
	
	this.showNotification = function(type, message, callback) {
		var features 	= "chrome,titlebar,toolbar,centerscreen,resizable,modal",
			windowVars 	= {
			extensions: extensions,
			type: type,
			message: message,
			callback: callback,
		};
		window.openDialog('chrome://ExportImportServers/content/notification.xul', "ImpExpNotification", features, windowVars);
	};

}).apply(extensions.ExportImportServers);
