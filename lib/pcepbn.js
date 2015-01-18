/*
 * PCE Instruments PB-N scale command line interface (CLI)
 *
 * @license BSDv2 (open source, free software)
 *
 * Copyright (c) 2015 Aron Homberg and the BeeMon development team.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module.exports = (function() {
    "use strict";

    var argv = require('optimist').argv,
        path = require('path'),
        cmd = argv['_'][0],
        subCmd = argv['_'][1],
        fs = require('fs');

    var me = {

        // Current version
        version: '0.1.1',

        /**
         * Discovers PCE-PB-N scale devices
         * @return void
         */
        discover: function() {

            var discover = require(__dirname + '/discover')();

            // runs the device discovery process
            discover.run(argv, me);
        },

        /**
         * Listens to PCE-PB-N scale devices
         * @return void
         */
        listen: function () {

            var listen = require(__dirname + '/listen')();

            if (subCmd && listen[String(subCmd).toLowerCase()]) {

                listen[String(subCmd).toLowerCase()](argv, me);

            } else {

                me.printListenHelp(subCmd);
            }
        },

        /**
         * Prints the listen SubCommand help message
         * @param {String} subCmd Name of the sub-command
         * @return void
         */
        printListenHelp: function(subCmd) {

            console.log('');
            console.log('pcepbn: listen -- v ' + me.version);
            console.log('');

            if (subCmd !== 'help' && typeof subCmd !== 'undefined') {
                console.log('[!!] Error: SubCommand "' + subCmd + '" not found, printing help:');
                console.log('');
            }

            console.log('Lists of [listen] SubCommands available:');
            console.log('');
            console.log('  help          Prints this help message');
            console.log('  once          Prints the current measurement value (one time)');
            console.log('  forever       Prints the current measurement values forever');
            console.log('');
            console.log('Options available:');
            console.log('');
            console.log('  -s            Specific scale device file/name (default: auto-discover)');
            console.log('');
            console.log('Example call:');
            console.log('');
            console.log('  # One-time, current measurement value of the scale attached:');
            console.log('  pcepbn listen once');
            console.log('');
            console.log('  # Continuously printing of values of a specific scale attached:');
            console.log('  pcepbn listen forever -s /dev/cu.SLAB_USBtoUART');
            console.log('');
        },

        /**
         * Called when the CLI gets called
         * @return void
         */
        cli: function() {

            // Call command
            if (cmd && me[String(cmd).toLowerCase()]) {

                me[String(cmd).toLowerCase()]();
            } else {
                me.printHelp(cmd);
            }
        },

        /**
         * Prints out the help
         * @param {String} cmd Command name used
         * @return void
         */
        printHelp: function(cmd) {

            console.log('');
            console.log('PCE Instruments PB-N scale CLI -- v ' + me.version);
            console.log('');

            if (cmd !== 'help' && typeof cmd !== 'undefined') {
                console.log('[!!] Error: Command "' + cmd + '" not found.');
                console.log('');
            }

            console.log('Lists of commands available in this version:');
            console.log('');
            console.log('  help      Prints this help message');
            console.log('  discover  Detects PCE PB-N scales, outputs the device file(s)');
            console.log('  listen    Fetches the scales latest measurement value');
            console.log('');
        }
    };
    return me;
})();