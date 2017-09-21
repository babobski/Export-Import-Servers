/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.ExportImportServers) === 'undefined') extensions.ExportImportServers = {
	version: '1.0.0'
};

if (!('extensions' in ko)) ko.extensions = {};

(function() {
	const DEBUG = false;
	const { classes: Cc, interfaces: Ci } = Components;
	var self = this;
	
	/**
	 * Import Servers From a Other Komodo Version
	 * @description Import server settings from different Komodo versions IDE/Edit Ko9 - Ko11
	 */
	this.importServersFromOtherVersion = function() {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");

		// get the "key3.db" file in the profile directory
		var file = FileUtils.getFile("ProfD", ["key3.db"]),
			base = file.parent,
			currPath = base.path;

		// Ko Versions install folders to test
		var koVersions = [
				'11.0', // TEST only
				'10.2',
				'10.1',
				'10.0',
				'9.3',
				'9.2',
				'9.1',
				'9.0',
				'8.5',
				'8.0',
				'7.1',
				'7.0',
			],
			isIDE = currPath.indexOf('KomodoIDE') !== -1,
			currVersion = function() {
				$currVersion = null;
				for (var i = 0; i < koVersions.length; i++) {
					if (ko.version.indexOf(koVersions[i]) !== -1) {
						$currVersion = koVersions[i];
					}
				}
				if (DEBUG) {
					console.log('Current version:' + $currVersion);
				}
				return $currVersion;
			},
			basePath = currPath.substr(0, currPath.indexOf(currVersion())),
			filePath = currPath.substr((currPath.indexOf(currVersion()) + currVersion().length), currPath.length),
			installedVersionsIDE = [],
			installedVersionsEdit = [],
			OSPathSeperator = Services.appinfo.OS === 'WINNT' ? '\\' : '/';

		// Test if the files exist
		for (var e = 0; e < koVersions.length; e++) {
			var testPath = basePath + koVersions[e] + filePath,
				otherTestPath = isIDE ? testPath.replace('KomodoIDE', 'KomodoEdit') : testPath.replace('KomodoEdit', 'KomodoIDE'),
				key3Leaf = OSPathSeperator + 'key3.db',
				loginsLeaf = OSPathSeperator + 'logins.json',
				key3Exist = false,
				loginsExist = false,
				otherKey3Exist = false,
				otherLoginsExist = false;


			// Test if key3.db exist in same type (IDE/Edit)
			try {
				var testFile = new FileUtils.File(testPath + key3Leaf);
				if (testFile.isFile()) {
					key3Exist = true;
				}
			} catch (e) {
				if (DEBUG) {
					console.log('File dos not exist: ' + testPath + key3Leaf);
				}
			}

			// Test if key3.db exist in other type (IDE/Edit)
			try {
				var otherTestFile = new FileUtils.File(otherTestPath + key3Leaf);
				if (otherTestFile.isFile()) {
					otherKey3Exist = true;
				}
			} catch (e) {
				if (DEBUG) {
					console.log('File dos not exist: ' + otherTestPath + key3Leaf);
				}
			}

			// Test if logins.json exist in same type (IDE/Edit)
			try {
				var testFileLogins = new FileUtils.File(testPath + loginsLeaf);
				if (testFileLogins.isFile()) {
					loginsExist = true;
				}
			} catch (e) {
				if (DEBUG) {
					console.log('File dos not exist: ' + testPath + loginsLeaf);
				}
			}

			// Test if logins.json exist in other type (IDE/Edit)
			try {
				var otherTestFileLogins = new FileUtils.File(otherTestPath + loginsLeaf);
				if (otherTestFileLogins.isFile()) {
					otherLoginsExist = true;
				}
			} catch (e) {
				if (DEBUG) {
					console.log('File dos not exist: ' + otherTestPath + loginsLeaf);
				}
			}

			// Add version if both files exist and skip current install
			if (key3Exist && loginsExist && currVersion() !== koVersions[e]) {
				var val = {
					version: koVersions[e],
					type: isIDE ? 'KomodoIDE' : 'KomodoEdit',
				};
				if (isIDE) {
					installedVersionsIDE.push(val);
				} else {
					installedVersionsEdit.push(val);
				}
			}

			// Add version if both files exist
			if (otherKey3Exist && otherLoginsExist) {
				var otherVal = {
					version: koVersions[e],
					type: !isIDE ? 'KomodoIDE' : 'KomodoEdit',
				};
				if (!isIDE) {
					installedVersionsIDE.push(otherVal);
				} else {
					installedVersionsEdit.push(otherVal);
				}
			}
		}

		var features = "chrome,titlebar,toolbar,centerscreen,resizable,modal";
		var windowVars = {
			extensions: extensions,
			versionsIDE: installedVersionsIDE,
			versionsEDIT: installedVersionsEdit,
			currentVersion: currVersion(),
		};
		window.openDialog('chrome://ExportImportServers/content/importServers.xul', "importServers", features, windowVars);
	};
	
	this.exportToFile = function() {
		console.log('exporting');
		 var features = "chrome,titlebar,toolbar,centerscreen,resizable,modal";
		 var windowVars = {
		 	extensions: extensions,
		 };
		 window.openDialog('chrome://ExportImportServers/content/exportToFile.xul', "exportToFile", features, windowVars);
	};
	
	this.importFromFile = function() {
		 var features = "chrome,titlebar,toolbar,centerscreen,resizable,modal";
		 var windowVars = {
		 	extensions: extensions,
		 };
		 window.openDialog('chrome://ExportImportServers/content/importFromFile.xul', "importFromFile", features, windowVars);
	};

	/**
	 * Preform actual import for the server settings
	 * 
	 * @param   {string} this           Version number to install from
	 * @param   {string} currentVersion Version to import the settings to
	 * @param   {string} type           If IDE or Edit
	 * 
	 */
	this.preformImportServers = function(version, currentVersion, type) {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		var file = FileUtils.getFile("ProfD", ["key3.db"]),
			logins = FileUtils.getFile("ProfD", ["logins.json"]);

		if (file !== 'undefined') {
			var currPath = file.path,
				isIDE = currPath.indexOf('KomodoIDE') !== -1,
				fileDir = file.parent,
				loginsPath = logins.path,
				basePath = currPath.substr(0, currPath.indexOf(currentVersion)),
				filePath = currPath.substr((currPath.indexOf(currentVersion) + currentVersion.length), currPath.length),
				testPath = basePath + version + filePath,
				finalTestPath = isIDE && type === 'KomodoIDE' ? testPath : (isIDE && type !== 'KomodoIDE' ? testPath.replace('KomodoIDE', 'KomodoEdit') : (!isIDE && type == 'KomodoEdit' ? testPath : testPath.replace('KomodoEdit', 'KomodoIDE'))),
				basePathLogins = loginsPath.substr(0, loginsPath.indexOf(currentVersion)),
				filePathLogins = loginsPath.substr((loginsPath.indexOf(currentVersion) + currentVersion.length), loginsPath.length),
				testPathLogins = basePathLogins + version + filePathLogins,
				finalTestPathLogins = isIDE && type === 'KomodoIDE' ? testPathLogins : (isIDE && type !== 'KomodoIDE' ? testPathLogins.replace('KomodoIDE', 'KomodoEdit') : (!isIDE && type == 'KomodoEdit' ? testPathLogins : testPathLogins.replace('KomodoEdit', 'KomodoIDE'))),
				copiedKey3 = false,
				copiedLogins = false;

			// Copy key3 to current install
			try {
				var testFile = new FileUtils.File(finalTestPath);
				if (testFile.isFile()) {
					testFile.copyTo(fileDir, 'key3.db');
					copiedKey3 = true;
					if (DEBUG) {
						console.log('copied key3.db');
					}
				}
			} catch (e) {
				if (DEBUG) {
					console.log('File dos not exist: ' + finalTestPath);
					console.log(e);
				}
			}

			// Copy logins to current install
			try {
				var testFileLogins = new FileUtils.File(finalTestPathLogins);
				if (testFileLogins.isFile()) {
					testFileLogins.copyTo(fileDir, 'logins.json');
					copiedLogins = true;
					if (DEBUG) {
						console.log('copied logins.json');
					}
				}
			} catch (e) {
				if (DEBUG) {
					console.log('File dos not exist: ' + finalTestPathLogins);
					console.log(e);
				}
			}

			if (copiedKey3 && copiedLogins) { // Files are imported time to restart Komodo
				self._showSuccesScreen('importServers');
			} else { // Something went wrong show manual instructions
				self._showErrorScreen('importServers');
			}

		}
	};
	
	this._preformActualExporttoFile = function() {
		
	};

	/**
	 * Remove addon and restart Komodo to apply settings
	 */
	this.restartKomodo = function() {
		// Restart Komodo to apply settings
		Components.utils.import('resource://gre/modules/AddonManager.jsm');
		AddonManager.getAddonByID('ExportImportServers@babobski.com', function(addon) {
			addon.uninstall();
			Components.classes["@mozilla.org/toolkit/app-startup;1"]
			.getService(Components.interfaces.nsIAppStartup)
			.quit(Components.interfaces.nsIAppStartup.eRestart | Components.interfaces.nsIAppStartup.eAttemptQuit);
		});
	};

	/**
	 * If import fails offer manual instructions 
	 */
	this.openManualInstructions = function() {
		ko.browse.openUrlInDefaultBrowser('https://community.komodoide.com/t/komodo-edit-10-doesnt-migrate-remote-servers-from-ke-9/2715/4');
	};

	/**
	 * Show success screen if imports are successful
	 */
	this._showSuccesScreen = function(windowName) {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher)
			.getWindowEnumerator(),
			index = 1;
			//windowName = "importServers";
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			if (win.name == windowName) {
				win.focus();
				/** @var winDoc document */
				var winDoc = win.document,
					startScreen = winDoc.getElementById('start'),
					successScreen = winDoc.getElementById('success');

				startScreen.style.display = 'none';
				successScreen.style.display = 'block';
				return;
			}
			index++;
		}
	};
	
	/**
	 * Show Error screen when imports fails
	 */
	this._showErrorScreen = function(windowName) {
		var wenum = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			.getService(Components.interfaces.nsIWindowWatcher)
			.getWindowEnumerator(),
			index = 1;
			//windowName = "importServers";
		while (wenum.hasMoreElements()) {
			var win = wenum.getNext();
			if (win.name == windowName) {
				win.focus();
				/** @var winDoc document */
				var winDoc = win.document,
					startScreen = winDoc.getElementById('start'),
					errorScreen = winDoc.getElementById('error');

				startScreen.style.display = 'none';
				errorScreen.style.display = 'block';
				return;
			}
			index++;
		}
	};
	
	/**
	 * Show Dialog on start-up
	 */
	//window.addEventListener('komodo-post-startup', self.importServersFromOtherVersion);

}).apply(extensions.ExportImportServers);
