/*
 * PCE Instruments PB-N scale command line interface (CLI)
 *
 * PCE-PN-N interface module.
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
        SerialPort = serialPort.SerialPort,

        // protocol related properties
        protocolBaudRate = 9600,
        closeMessageCode = 10,
        maximumBufferReadTime = 2500,

        me = {

            /**
             * Runs the discovery process
             * @param {String} device Device file/name
             * @param {Function} callback Callback to inform if the device is a proper PCE-PB-N device
             * @return void
             */
            probe: function(device, callback) {

                me.read(device, function onSuccess(buffer, port) {

                    callback(device, true);

                }, function onError(errorMessage, buffer, port) {

                    callback(device, false, errorMessage);
                });
            },

            /**
             * Reads the device's buffer data
             * @param {String} device Device file/name
             * @param {Function} successCallback Gets called when reading finishes successfully
             * @param {Function} errorCallback Gets called when reading finishes with an error
             * @param {Boolean} forever Flag to read forever
             */
            read: function(device, successCallback, errorCallback, forever) {

                var port = new SerialPort(device, {
                    baudrate: protocolBaudRate
                });

                port.on("open", function() {

                    var readCount = 0,
                        buffer = '';

                    // data transmitted
                    port.on('data', function(data) {

                        // increment read count
                        readCount++;

                        // convert Buffer datatype into String
                        data = String(data);

                        // append data to buffer
                        buffer += data;

                        // close after preClose
                        if (data.charCodeAt(0) == closeMessageCode) {

                            successCallback(buffer, port);

                            // check for protocol errors
                            if (buffer.indexOf('-') === -1 &&
                                buffer.indexOf('+') === -1) {

                                errorCallback('Unknown protocol.', buffer, port);
                            }

                            buffer = '';
                            readCount = 0;

                            if (!forever) {
                                port.close();
                            }
                        }
                    });
                });

                // error transmitted
                port.on('error', function(e) {

                    errorCallback(e.message, '', port);
                });

                // timeout
                setTimeout(function() {

                    errorCallback('Timed out while trying to read data.', '', port);

                }, maximumBufferReadTime);
            },

            /**
             * Parses the measurement value from buffer and returns an object
             * @param {String} buffer Read buffer
             * @return {Object}
             */
            parse: function(buffer) {

                var message = buffer.substring(0, buffer.length-2);

                var measurement = {
                    sign: message[0],
                    tenThousands: Number(message[2]),
                    thousands: Number(message[3]),
                    hundreds: Number(message[4]),
                    tens: Number(message[5]),
                    ones: Number(message[6]),
                    decimalTens: Number(message[8]),
                    decimalOnes: Number(message[9]),
                    error: false
                };

                // parse measurement unit
                measurement.unit = String(message[11] + message[12] + message[13])
                                    .trim()
                                    .toUpperCase();

                // parse numeric value
                measurement.value = parseFloat(
                    message[2] + message[3] + message[4] + message[5] + message[6] +
                    '.' +
                    message[8] +
                    message[9],
                    10
                );

                // parse error
                if (isNaN(measurement.value) ||
                    measurement.unit == 'NaN') {

                    measurement.error = true;
                }

                return measurement;
            }
        };

    return me;
});