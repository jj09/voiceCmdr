/*!
 * voiceCmdr JavaScript library v0.1.3
 * (c) Jakub Jedryszek - http://jj09.net/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

var voiceCmdr = (function () {
    var that = this;

    this.recognition = window.webkitSpeechRecognition && new webkitSpeechRecognition();

    this.isSupported = function () {
        return !!that.recognition;
    };

    if (this.isSupported()) {
        // API

        // register command, and its callback function
        this.addCommand = function (command, f) {
            if (that.DEBUG) {
                console.debug('added command:', command);
            }

            that.commands[command] = f;
        };

        // remove command
        // @return if command exists: true
        //         else: return false
        this.removeCommand = function (command) {
            if (that.DEBUG) {
                console.debug('removed command:', command);
            }

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

            if (that.DEBUG) {
                console.debug('started listening');
            }
        };

        // stop listening for commands
        this.stop = function() {
            that.recognition.continuous = false;
            that.recognition.stop();

            if (that.DEBUG) {
                console.debug('stopped listening');
            }
        };

        // listening for single command
        this.getCommand = function() {
            that.recognition.continuous = false;
            that.recognition.start();

            if (that.DEBUG) {
                console.debug('listening for single command');
            }
        };

        this.debug = function(mode) {
            that.DEBUG = !!mode;
        };
        
        
        // logic

        this.finalTranscript = '';
        this.commands = {};
        this.DEBUG = false;
        this.recognizing = false;

        this.isRecognizing = function () { 
            return that.recognizing; 
        };

    
        this.recognition.onstart = function () {
            that.recognizing = true;
        };

        this.recognition.onresult = function (event) {
            if (typeof (event.results) === 'undefined') {
                if (that.DEBUG) {
                    console.debug('undefined result');
                }
                
                that.recognition.stop();
                
                return;
            }

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    that.finalTranscript += event.results[i][0].transcript;
                }
            }

            if (that.finalTranscript !== '') {
                that.finalTranscript = that.finalTranscript.toLowerCase().trim();

                if (that.DEBUG) {
                    console.debug('received command:', that.finalTranscript);
                }

                for (var command in that.commands) {
                    if (that.finalTranscript.indexOf(command) === 0) {
                        if (that.finalTranscript[command.length] === undefined) {
                            if (that.DEBUG) {
                                console.debug('calling command', command);
                            }
                            
                            that.commands[command]();
                        } else if (that.finalTranscript[command.length] === ' ') {
                            var param = that.finalTranscript.substring(command.length, that.finalTranscript.length).trim();
                            
                            if (that.DEBUG) {
                                console.debug('calling command', command, 'with param:', param);
                            }
                            
                            that.commands[command](param);
                        }
                    }
                }

                that.finalTranscript = '';
            } else {
                if (that.DEBUG) {
                    console.debug('received empty command');
                }
            }
        };

        this.recognition.onerror = function (event) {
            if (that.DEBUG) {
                console.debug('error occured', event);
            }
        };
        
        this.recognition.onend = function (event) {
            that.recognizing = false;
            if (that.DEBUG) {
                console.debug('end', event);
            }

            if (that.recognition.continuous) {
                if (that.DEBUG) {
                    console.debug('restarting', that.recognition.continuous);
                }
                
                that.recognition.start();
            }
        };
    }

    return {
        isSupported: that.isSupported,
        addCommand: that.addCommand,
        removeCommand: that.removeCommand,
        start: that.start,
        stop: that.stop,
        getCommand: that.getCommand,
        debug: that.debug,
        isRecognizing: that.isRecognizing
    };
})();
