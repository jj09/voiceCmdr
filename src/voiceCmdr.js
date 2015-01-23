/*!
 * voiceCmdr JavaScript library v0.1.0
 * (c) Jakub Jedryszek - http://jj09.net/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

/*global webkitSpeechRecognition:false */

/*jshint unused:false*/
var voiceCmdr = (function () {
    var that = this;

    // API

    // register command, and its callback function
    this.addCommand = function (command, f) {
        if (that.DEBUG) console.debug("added command:", command);
        that.commands[command] = f;
    };

    // remove command
    // @return if command exists: true
    //         else: return false
    this.removeCommand = function (command) {
        if (that.DEBUG) console.debug("removed command:", command);
        if (that.commands[command]) {
            delete that.commands[command];
            return true;
        }

        return false;
    };

    // start listening for commands
    this.start = function () {
        that.recognition.continuous = true;
        that.recognition.start();
        if (that.DEBUG) console.debug("started listening");
    };

    // stop listening for commands
    this.stop = function() {
        that.recognition.continuous = false;
        that.recognition.stop();
        if (that.DEBUG) console.debug("stopped listening");
    };

    // listening for single command
    this.getCommand = function() {
        that.recognition.continuous = false;
        that.recognition.start();
        if (that.DEBUG) console.debug("listening for single command");
    };

    this.debug = function(mode) {
        that.DEBUG = !!mode;
    };
    
    // logic

    this.recognition = new webkitSpeechRecognition();
    this.final_transcript = "";
    this.commands = {};
    this.DEBUG = false;
    this.recognizing = false;

    this.getRecognizing = function () { 
        return that.recognizing; 
    }

    this.recognition.onstart = function () {
        that.recognizing = true;
    };

    this.recognition.onresult = function (event) {
        if (typeof (event.results) === "undefined") {
            if (that.DEBUG) console.debug("undefined result");
            //recognition.onend = null;
            that.recognition.stop();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                that.final_transcript += event.results[i][0].transcript;
            }
        }
        if (that.final_transcript !== "") {
            that.final_transcript = that.final_transcript.toLowerCase().trim();
            if (that.DEBUG) console.debug("received command:", that.final_transcript);

            for (var command in that.commands) {
                if (that.final_transcript.indexOf(command) === 0) {
                    if (that.final_transcript[command.length] === undefined) {
                        if (that.DEBUG) console.debug("calling command", command, "without params");
                        that.commands[command]();
                    } else if (that.final_transcript[command.length] === " ") {
                        var param = that.final_transcript.substring(command.length, that.final_transcript.length).trim();
                        if (that.DEBUG) console.debug("calling command", command, "with param:", param);
                        that.commands[command](param);
                    }
                }
            }

            that.final_transcript = "";
        } else {
            if (that.DEBUG) console.debug("received empty command");
        }
    };

    this.recognition.onerror = function (event) {
        if (that.DEBUG) console.debug("error occured", event);
    };
    
    this.recognition.onend = function (event) {
        that.recognizing = false;
        if (that.DEBUG) console.debug("end", event);
        if (that.recognition.continuous) {
            if (that.DEBUG) console.debug("restarting", that.recognition.continuous);
            that.recognition.start();
        }
    };

    return {
        addCommand: that.addCommand,
        removeCommand: that.removeCommand,
        start: that.start,
        stop: that.stop,
        getCommand: that.getCommand,
        debug: that.debug,
        recognizing: that.getRecognizing
    };
})();