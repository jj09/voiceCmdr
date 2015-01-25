# voiceCmdr
voiceCmdr is a library for adding voice commands to your website. It is build on top of Webkit Speech API.

## Browser support

* Google Chrome 31+

## Getting started

Install with npm:

		npm install voice-cmdr

Install with bower:

		bower install voice-cmdr

Run http server with built in python module:

		python -m SimpleHTTPServer 8080

Then open localhost:8080 in your browser and navigate to examples directory.

(*) Voice recognition works only through http protocol. That's why you have to serve static files through the server instead just open them in the browser.

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

## To Do

* Add Safari support

* Add setting language
	
## License
[MIT](http://www.opensource.org/licenses/mit-license.php)