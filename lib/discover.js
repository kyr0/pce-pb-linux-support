/*
 * PCE Instruments PB-N scale command line interface (CLI)
 *
 * Device discovery module.
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

    var fs = require('fs'),
        serialPort = require("serialport"),
        PCEInterface = require("../lib/interface")(),

        probeTimeout = 2500,

        me = {

            /**
             * Really discovers the pce-pb-n scale devices
             * @param {Function} callback Function to be called when a scale is discovered
             * @protected
             * @return void
             */
            _discover: function (callback) {

                var comDevice;

                // fetch all serial ports available
                serialPort.list(function (err, ports) {

                    var portsProbed = 0,
                        pcepbnDevicesList = [];

                    // walk each serial port and probe
                    ports.forEach(function(port) {

                        PCEInterface.probe(port.comName, function(scaleDevice, isPCEPBNDevice) {

                            if (isPCEPBNDevice) {
                                pcepbnDevicesList.push(scaleDevice);
                            }
                            portsProbed++;

                            // walked the list? exit.
                            if (portsProbed === ports.length) {
                                callback(pcepbnDevicesList);
                            }
                        });
                    });

                    // ran in timeout? (device blocking?) exit.
                    setTimeout(function() {

                        callback([]);

                    }, probeTimeout);
                });
            },

            /**
             * Runs the discovery process
             * @param {Object} argv Optimist instance object
             * @param {Object} pcepbn pcepbn app object
             * @return void
             */
            run: function(argv, pcepbn) {

                console.log('pcepbn: discover -- v ' + pcepbn.version);
                console.log('');
                console.log('[i] The following PCE-PB-N-series devices were found: ');
                console.log('');

                // call the internal discovery process
                me._discover(function onDiscover(scaleDevices) {

                    // just print out the scale device file/name
                    scaleDevices.forEach(function(scaleDevice) {
                        console.log(scaleDevice);
                    });

                    if (scaleDevices.length === 0) {
                        console.log('[!] No devices found. Exiting.');
                    }

                    process.exit(0);
                });
            }
        };

    return me;
});