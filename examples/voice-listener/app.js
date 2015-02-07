if(voiceCmdr.isSupported()) {
	voiceCmdr.addCommand("hi", function (command) {
		$("#command").text(command);
	});

	voiceCmdr.start();
} else {
	console.info("Sorry, your browser does not support the Web Speech API :(")
}
