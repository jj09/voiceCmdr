# voiceCmdr
voiceCmdr is a library for adding voice commands to your website. It is build on top of Webkit Speach API.

## Browser support

* Google Chrome 31+

## Getting started

Check examples directory. You need to access your website through http or https protocol. Thus, you need to host your website on some server (can be localhost). 

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
	
## LICENSE
[MIT](http://www.opensource.org/licenses/mit-license.php)