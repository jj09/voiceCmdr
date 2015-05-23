/*!
 * voiceCmdr JavaScript library v0.1.3
 * (c) Jakub Jedryszek - http://jj09.net/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

var voiceCmdr = (function () {
    'use strict';

    var cmdr = {};

    cmdr.recognition = window.webkitSpeechRecognition && new webkitSpeechRecognition();

    cmdr.isSupported = function () {
        return !!cmdr.recognition;
    };

    if (cmdr.isSupported()) {
        // API

        // register command, and its callback function
        cmdr.addCommand = function (command, f) {
            if (cmdr.DEBUG) {
                console.debug('added command:', command);
            }

            cmdr.commands[command] = f;
        };

        // remove command
        // @return if command exists: true
        //         else: return false
        cmdr.removeCommand = function (command) {
            if (cmdr.DEBUG) {
                console.debug('removed command:', command);
            }

            if (cmdr.commands[command]) {
                delete cmdr.commands[command];
                return true;
            }

            return false;
        };

        // start listening for commands
        cmdr.start = function () {
            cmdr.recognition.continuous = true;
            cmdr.recognition.start();   // async call

            if (cmdr.DEBUG) {
                console.debug('started listening');
            }
        };

        // stop listening for commands
        cmdr.stop = function() {
            cmdr.recognition.continuous = false;
            cmdr.recognition.stop();    // async call

            if (cmdr.DEBUG) {
                console.debug('stopped listening');
            }
        };

        // listening for single command
        cmdr.getCommand = function() {
            var timeout = 1;

            if(cmdr.isRecognizing()) {
                cmdr.stop();

                // timeout is needed to allow async stop() function to execute
                // otherwise - start will be called before previous listening were aborted and error will occur
                timeout = 1000;
            }

            setTimeout(function () {
                cmdr.recognition.continuous = false;
                cmdr.recognition.start();

                if (cmdr.DEBUG) {
                    console.debug('listening for single command');
                }            
            }, timeout);
        };

        cmdr.debug = function(mode) {
            cmdr.DEBUG = !!mode;
        };
        
        
        // logic

        cmdr.finalTranscript = '';
        cmdr.commands = {};
        cmdr.DEBUG = false;
        cmdr.recognizing = false;

        cmdr.isRecognizing = function () { 
            return cmdr.recognizing; 
        };

    
        cmdr.recognition.onstart = function () {
            cmdr.recognizing = true;

            if (cmdr.DEBUG) {
                console.debug('start', event);
            }
        };

        cmdr.recognition.onresult = function (event) {
            if (typeof (event.results) === 'undefined') {
                if (cmdr.DEBUG) {
                    console.debug('undefined result');
                }
                
                cmdr.recognition.stop();
                
                return;
            }

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    cmdr.finalTranscript += event.results[i][0].transcript;
                }
            }

            if (cmdr.finalTranscript !== '') {
                cmdr.finalTranscript = cmdr.finalTranscript.toLowerCase().trim();

                if (cmdr.DEBUG) {
                    console.debug('received command:', cmdr.finalTranscript);
                }

                for (var command in cmdr.commands) {
                    if (cmdr.finalTranscript.indexOf(command) === 0) {
                        if (cmdr.finalTranscript[command.length] === undefined) {
                            if (cmdr.DEBUG) {
                                console.debug('calling command', command);
                            }
                            
                            cmdr.commands[command]();
                        } else if (cmdr.finalTranscript[command.length] === ' ') {
                            var param = cmdr.finalTranscript.substring(command.length, cmdr.finalTranscript.length).trim();
                            
                            if (cmdr.DEBUG) {
                                console.debug('calling command', command, 'with param:', param);
                            }
                            
                            cmdr.commands[command](param);
                        }
                    }
                }

                cmdr.finalTranscript = '';
            } else {
                if (cmdr.DEBUG) {
                    console.debug('received empty command');
                }
            }
        };

        cmdr.recognition.onerror = function (event) {
            if (cmdr.DEBUG) {
                console.debug('error occured', event);
            }
        };
        
        cmdr.recognition.onend = function (event) {
            cmdr.recognizing = false;
            if (cmdr.DEBUG) {
                console.debug('end', event);
            }

            if (cmdr.recognition.continuous) {
                if (cmdr.DEBUG) {
                    console.debug('restarting', cmdr.recognition.continuous);
                }
                
                cmdr.recognition.start();
            }
        };
    }

    return {
        isSupported: cmdr.isSupported,
        addCommand: cmdr.addCommand,
        removeCommand: cmdr.removeCommand,
        start: cmdr.start,
        stop: cmdr.stop,
        getCommand: cmdr.getCommand,
        debug: cmdr.debug,
        isRecognizing: cmdr.isRecognizing
    };
})();
