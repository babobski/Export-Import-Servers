/**
 * Small Komodo Helper
 * @author babobski
 * @version 1.0
 */


var koXI = {};
var notify = require("notify/notify");
var koFile = require("ko/file");
var uri = ko.uriparse;

var CC = Components.classes;
var CI = Components.interfaces;

function createFileIfNotExist($url) {
	if (!koFile.exists($url)) {
		var path = uri.dirName($url);
		var fileName = uri.baseName($url);
		
		koFile.mkpath(path);
		koFile.create(path, fileName);  
	}
	return;
}


/**
 * Save a File to a remote or local location
 * 
 * @param   {string} filepath    Path to write the content to (will create the file if it is not present)
 * @param   {string} filecontent Content to save
 * 
 */
koXI.saveFile = function(filepath, filecontent) {

	var file = Components
		.classes["@activestate.com/koFileEx;1"]
		.createInstance(Components.interfaces.koIFileEx);
	file.path = filepath;

	file.open('w');

	file.puts(filecontent);
	file.close(); 

	return;
};


/**
 * Read a File from a remote or local location
 * 
 * @param   {string} filepath File path to read
 * 
 * @returns {string} The file content.
 */
koXI.readFile = function(filepath) {

	var reader = Components.classes["@activestate.com/koFileEx;1"]
		.createInstance(Components.interfaces.koIFileEx),
		placeholder;

	reader.path = filepath;

	try {
		reader.open("r");
		placeholder = reader.readfile();
		reader.close();

		return placeholder;

	} catch (e) {
		notify.send('ERROR: Reading file: ' + filepath, 'tools');
	}

	return false;
};

/**
 * Store content in a file in the users profile folder.
 * Information stored here will persist between start-ups.
 * 
 * @param   {string} folderName	 Folder to save the file to.
 * @param   {string} fileName    File name
 * @param   {string} content     Content to save
 * 
 */
koXI.storeContent = function(folderName, fileName, content) {
	var OSSep = Services.appinfo.OS === 'WINNT' ? '\\' : '/';
	var file = folderName + OSSep + fileName;
	
	createFileIfNotExist(file);
	koXI.saveFile(file, content);
	return;
}

/**
 * Read content from a file in the users profile folder.
 * 
 * @param   {string} folderName	 Folder to save the file to.
 * @param   {string} fileName    File name
 * 
 * @returns {string} content
 */
koXI.readContent = function(folderName, fileName) {
	var OSSep = Services.appinfo.OS === 'WINNT' ? '\\' : '/';
	var file = folderName + OSSep + fileName;
	var fileContent = koXI.readFile(file);
	
	return fileContent;
}

/**
 * Store a object in the user profile folder.
 * Information stored here will persist between start-ups.
 * 
 * @param   {string} folderName      	Foldername to store the file to
 * @param   {string} fileName 			Filename
 * @param   {string} name     			id to retrieve the object
 * @param   {object} obj      			JavaScript object to store
 * 
 */
koXI.storeObj = function(folderName, fileName, obj) {
	
	var OSSep = Services.appinfo.OS === 'WINNT' ? '\\' : '/';
	var file = folderName + OSSep + fileName;
	console.log(obj);
	var fileContent = '{ "content": ' + JSON.stringify(obj) + '}';
	
	createFileIfNotExist(file);
	koXI.saveFile(file, fileContent);
	return;
};

/**
 * Read a object from the user profile folder.
 * Information stored here will persist between start-ups.
 * 
 * @param   {string} folderName      	Foldername to store the file to
 * @param   {string} fileName 			Filename
 * @param   {string} name     			id to retrieve the object
 *
 * @returns  {object} obj      			JavaScript object to store
 */
koXI.readObj = function(file) {
	
	var fileContent = koXI.readFile(file);
	var obj;
	
	if (fileContent === false) {
		return false;
	}
	
	obj = JSON.parse(fileContent);
	
	return obj.content;
};

/**
 * Returns a parsed url
 * 
 * @param   {string} url url to parse
 * 
 * @returns {string} parsed url
 */
koXI.URI = function(url) {
	return ko.uriparse.displayPath(url);
};

/**
 * Send notification
 * 
 * @param   {string} message Message to send
 * 
 */
koXI.alert = function(message) {
	notify.send(message, 'tools');
	return;
};

/**
 * Check if value exists in array
 * 
 * @param   {string} koXI   Search value
 * @param   {array} array  Array to search in
 * 
 * @returns {Boolean} returns true if value found
 */
koXI.in_array = function(search, array) {
	for (i = 0; i < array.length; i++) {
		if (array[i] == search) {
			return true;
		}
	}
	return false;
};

/**
 * Merge two objects together
 * 
 * @param   {object} obj1 
 * @param   {object} obj2 
 * 
 * @returns {object}
 */
koXI._merge_objects = function(obj1,obj2, obj3){
	return  Object.assign(obj1,obj2,obj3);
};


