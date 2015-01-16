/*!
 * voiceCmdr JavaScript library v0.1.0
 * (c) Jakub Jedryszek - http://jj09.net/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

/*global webkitSpeechRecognition:false */

/*jshint unused:false*/
var voiceCmdr = (function () {
    var self = this;

    // API

    // register command, and its callback function
    this.addCommand = function (command, f) {
        if (self.DEBUG) console.debug("added command:", command);
        self.commands[command] = f;
    };

    // remove command
    // @return if command exists: true
    //         else: return false
    this.removeCommand = function (command) {
        if (self.DEBUG) console.debug("removed command:", command);
        if (self.commands[command]) {
            delete self.commands[command];
            return true;
        }

        return false;
    };

    // start listening for commands
    this.start = function () {
        self.recognition.continuous = true;
        self.recognition.start();
        if (self.DEBUG) console.debug("started listening");
    };

    // stop listening for commands
    this.stop = function() {
        self.recognition.continuous = false;
        self.recognition.stop();
        if (self.DEBUG) console.debug("stopped listening");
    };

    // listening for single command
    this.getCommand = function() {
        self.recognition.continuous = false;
        self.recognition.start();
        if (self.DEBUG) console.debug("listening for single command");
    };

    this.debug = function(mode) {
        self.DEBUG = !!mode;
    };
    
    // logic

    this.recognition = new webkitSpeechRecognition();
    this.final_transcript = "";
    this.commands = {};
    this.DEBUG = false;
    this.recognizing = false;

    this.getRecognizing = function () { 
        return self.recognizing; 
    }

    this.recognition.onstart = function () {
        self.recognizing = true;
    };

    this.recognition.onresult = function (event) {
        if (typeof (event.results) === "undefined") {
            if (self.DEBUG) console.debug("undefined result");
            //recognition.onend = null;
            self.recognition.stop();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                self.final_transcript += event.results[i][0].transcript;
            }
        }
        if (self.final_transcript !== "") {
            self.final_transcript = self.final_transcript.toLowerCase().trim();
            if (self.DEBUG) console.debug("received command:", self.final_transcript);

            for (var command in self.commands) {
                if (self.final_transcript.indexOf(command) === 0) {
                    if (self.final_transcript[command.length] === undefined) {
                        if (self.DEBUG) console.debug("calling command", command, "without params");
                        self.commands[command]();
                    } else if (self.final_transcript[command.length] === " ") {
                        var param = self.final_transcript.substring(command.length, self.final_transcript.length).trim();
                        if (self.DEBUG) console.debug("calling command", command, "with param:", param);
                        self.commands[command](param);
                    }
                }
            }

            self.final_transcript = "";
        } else {
            if (self.DEBUG) console.debug("received empty command");
        }
    };

    this.recognition.onerror = function (event) {
        if (self.DEBUG) console.debug("error occured", event);
    };
    
    this.recognition.onend = function (event) {
        self.recognizing = false;
        if (self.DEBUG) console.debug("end", event);
        if (self.recognition.continuous) {
            if (self.DEBUG) console.debug("restarting", self.recognition.continuous);
            self.recognition.start();
        }
    };

    return {
        addCommand: self.addCommand,
        removeCommand: self.removeCommand,
        start: self.start,
        stop: self.stop,
        getCommand: self.getCommand,
        debug: self.debug,
        recognizing: self.getRecognizing
    };
})();