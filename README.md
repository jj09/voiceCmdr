# voiceCmdr

[![Build Status](https://travis-ci.org/jj09/voiceCmdr.svg?branch=master)](https://travis-ci.org/jj09/voiceCmdr)
[![npm version](https://badge.fury.io/js/voice-cmdr.svg)](http://badge.fury.io/js/voice-cmdr)

voiceCmdr is a library for adding voice commands to your website. It is build on top of Webkit Speech API.

## Browser support

* Google Chrome 31+

## Getting started

Install with npm:

	npm install voice-cmdr

Install with bower:

	bower install voice-cmdr

Run http server (can be installed with `npm install -g http-server`):

	http-server

Then open localhost:8080 in your browser and navigate to examples directory.

(*) Voice recognition works only through http protocol. That's why you have to serve static files through the server instead of just opening them in the browser.

(**) Pages hosted on HTTPS do not need to ask repeatedly for permission, whereas HTTP hosted pages do.

## API

* Add command:

		voiceCmdr.addCommand("command", callbackFunction);

	Example:

		voiceCmdr.addCommand("home", function () {
			// navigate to home page
		});
		
		voiceCmdr.addCommand("search", function (param) {
			console.log("Searching for:", param);
		});	

* Remove command:

		voiceCmdr.removeCommand("command");

* Start listening (continuously):

		voiceCmdr.start();

* Stop listening:

		voiceCmdr.stop();

* Get single command:

		voiceCmdr.getCommand();

* Turn debug mode on/off:

		voiceCmdr.debug(true|false);

## Demo

[www.bookslib.azurewebsites.net](http://bookslib.azurewebsites.net)

Available commands:

	books
	favorites
	top 10
	search [string]

## To Do

* lowercase commands
* Stop restarting after 5 tries (if user set deny the restarting will work infinitely)
* Add setting language
* Tests (???):
	* addCommand
		* Works
		* Can overwrite existing without error
	* removeCommand
		* Remove existing returns true
		* Remove non-existing returns false
	* in browser with karma (???)
	* Jasmine vs Mocha+Chai+Sinon with mocking window + webkitSpeechRecognition (???)
	
## License
[MIT](http://www.opensource.org/licenses/mit-license.php)
