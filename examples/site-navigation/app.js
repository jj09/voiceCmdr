// site navigation
function navigateHome() {
	$("#title").html("Home");
	$("#content").html("This is main page.");
}

function navigateBlog() {
	$("#title").html("Blog");
	$("#content").html("Blog entries...");
}

function navigateHelp() {
	$("#title").html("Help");
	$("#content").html("Some help about the website.");
}

$("#menu-home").click(function () {
	navigateHome();
});

$("#menu-blog").click(function () {
	navigateBlog();
});

$("#menu-help").click(function () {
	navigateHelp();
});

// voice commands
if(voiceCmdr.isSupported()) {
	voiceCmdr.addCommand("go home", function () {
		navigateHome();
	});

	voiceCmdr.addCommand("go", function (param) {
		if (param === "blog") {
			navigateBlog();
		} else if (param === "help") {
			navigateHelp();
		}
	});

	voiceCmdr.start();

	// turn debug mode on/off
	$("#toggleLogging").click(function () {
		var turnOnLabel = "turn on",
			turnOffLabel = "turn off";

		if ($(this).text() === turnOnLabel) {
			voiceCmdr.debug(true);
			$(this).text(turnOffLabel);
		} else {
			voiceCmdr.debug(false);
			$(this).text(turnOnLabel);
		}
	});
} else {
	console.info("Sorry, your browser does not support the Web Speech API :(")
}
