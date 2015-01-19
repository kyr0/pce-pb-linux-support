/*
 * PCE Instruments PB-N scale command line interface (CLI)
 *
 * Device listening module.
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
        discover = require(__dirname + "/discover")(),
        PCEInterface = require(__dirname + "/interface")(),
        readAllDevices = false,

        /**
         * @var {Object} outputFormats
         * Map of output formats available for rendering
         */
        outputFormats = {
            plain: 'Plain',
            json: 'Json'
        },
        opts = {},

        me = {

            /**
             * Returns the build-related arguments as a plain object
             * @param {Object} argv Optimist instance object
             * @return {Object}
             * @private
             */
            _getOpts: function(argv) {

                return {
                    s: argv['s'] || false,
                    f: argv['f'] || 'plain'
                };
            },

            /**
             * Listens to scale device(s)
             * @param {Boolean} forever Forever run flag
             * @param {Object} argv Optimist instance object
             * @param {Object} pcepbn pcepbn app object
             * @private
             */
            _listen: function(forever, argv, pcepbn) {

                console.log('pcepbn: listen -- v ' + pcepbn.version);
                console.log('');

                // cache CLI options
                opts = me._getOpts(argv);

                var scaleDevice = opts['s'],
                    listen = function(scaleDevice, callback) {

                        PCEInterface.read(scaleDevice, function onSuccess(buffer, port) {

                            callback(scaleDevice, buffer, false, port, forever);

                        }, function onError(errorMessage, buffer, port) {

                            callback(scaleDevice, buffer, errorMessage, port, forever);

                        }, forever);
                    };

                if (!scaleDevice) {

                    // listen to all scale devices attached
                    discover._discover(function(scaleDevices) {

                        var readCount = 0;

                        // just print out the scale device file/name
                        scaleDevices.forEach(function(scaleDevice) {

                            // increment read count
                            readCount++;

                            // set flag that all devices have been read
                            if (readCount == scaleDevices.length) {
                                readAllDevices = true;
                            }

                            listen(scaleDevice, me._onRead);
                        });

                    });

                } else {

                    readAllDevices = true;

                    // listen to the specific scale device named
                    listen(scaleDevice, me._onRead);
                }
            },

            /**
             * Triggers a read buffer parse and prints out the parsed
             * measurement value to the output.
             * @private
             */
            _onRead: function(scaleDevice, buffer, error, port, forever) {

                // parse
                var measurement = PCEInterface.parse(buffer);

                // print measurement value
                me._printMeasurement(scaleDevice, measurement);

                // all devices read and
                if (!forever && readAllDevices) {
                    process.exit(0);
                }
            },

            /**
             * Prints out the measurement value formatted
             * @param {String} scaleDevice Scale device file/name
             * @param {Object} measurement Measurement value
             * @private
             */
            _printMeasurement: function(scaleDevice, measurement) {

                if (!measurement.error) {

                    console.log(

                        me._renderMeasurementValue(
                            scaleDevice,
                            measurement,
                            opts.f
                        )
                    );
                }
            },

            /**
             * @private
             * Returns the measurement value formatted
             * @return {String}
             */
            _renderMeasurementValue: function(scaleDevice, measurement, format) {

                var renderMethod = '_render' + outputFormats[format];

                if (!outputFormats[format] || !me[renderMethod]) {

                    console.error('[!] Output format not available. Exiting.');
                    process.exit(1);

                } else {

                    // call the rendering method dynamically
                    return me[renderMethod](scaleDevice, measurement);
                }
            },

            /**
             * @private
             * Renders the measurement value in JSON format
             * @param {String} scaleDevice Device file/name
             * @param {Object} measurement Measured value object
             * @return {String}
             */
            _renderJson: function(scaleDevice, measurement) {

                var toSerialize = measurement;

                // add device file/name
                toSerialize.device = scaleDevice;

                return JSON.stringify(toSerialize);
            },

            /**
             * @private
             * Renders the measurement value in JSON format
             * @param {String} scaleDevice Device file/name
             * @param {Object} measurement Measured value object
             * @return {String}
             */
            _renderPlain: function(scaleDevice, measurement) {
                return scaleDevice + ': ' + measurement.value + ' ' + measurement.unit;
            },

            /**
             * Runs the listen process once
             * @param {Object} argv Optimist instance object
             * @param {Object} pcepbn pcepbn app object
             * @return void
             */
            once: function(argv, pcepbn) {

                me._listen(/*single*/ false, argv, pcepbn);
            },

            /**
             * Runs the listen process forever
             * @param {Object} argv Optimist instance object
             * @param {Object} pcepbn pcepbn app object
             * @return void
             */
            forever: function(argv, pcepbn) {

                me._listen(/*single*/ true, argv, pcepbn);
            }
        };

    return me;
});