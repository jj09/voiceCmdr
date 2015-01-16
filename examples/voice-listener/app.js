voiceCmdr.addCommand("hi", function (command) {
	$("#command").text(command);
});

voiceCmdr.start();