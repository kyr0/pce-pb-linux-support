# Command line interface (CLI) for PCE-PB-N-series scales

This projects implements LINUX and Mac OS X support 
for PCE Instruments PB-N-series scales PCE-PB 60N and PCE-PB 150N.

This program allows you to discover PCE PB N scale devices attached to any LINUX/Mac OS X computer
and to fetch the latest measurement values (one-time and continuously).

This software is primarily developed and used by the BeeMon project (https://github.com/kyr0/beemon)

The development team likes to thank PCE Deutschland GmbH for supporting us!

## Pre-requirements

Please note that you need to install the SILABS (SILICON LABS) CP210x 
USB to UART Bridge VCP Drivers to ensure this program is able to detect 
your PCE PB-N scale.

Please install the CP210x driver suitable for your operating system:

    https://www.silabs.com/products/mcu/Pages/USBtoUARTBridgeVCPDrivers.aspx

### Driver installation test: Mac OS X

Connect the PCE PB-N scale to your computer.
Open a terminal (Cmd+Space, type "Terminal", hit "ENTER") and execute: 

    sudo kextstat | grep "CP210x"

If the output is somewhat like:

    0 0xffffff7f82fc4000 0x7000     0x7000     com.silabs.driver.CP210xVCPDriver64 (3.1.0d1) <124 39 4 3>
    
The CP210x driver has been already/successful installed.
    
### Driver installation test: Linux/Unix
   
Connect the PCE PB-N scale to your computer.
Open a shell and execute:

    sudo lsmod | grep "cp210x"
   
If the output is somewhat like:

    cp210x                  8389  0
    usbserial              26684  1 cp210x

The cp210x kernel driver for LINUX has been already/successful installed.
    
## Installation

### Runtime environment: Node.js
    
In order to run this command line tool you need install Node.js, 
the runtime environment, this program relies on. Node.js is a 
blazing fast, open source and free JavaScript runtime. 
It requires only minimal system resources:

    http://nodejs.org/
    
Linux users may want to use the distributions package manager 
of choice. To do so, please follow the installation instructions
on the following wiki page:

   https://github.com/joyent/node/wiki/installing-node.js-via-package-manager
   
### The "pcepbn" command line interface
    
After you've successfully installed Node.js, open a terminal
and execute the following command:

    sudo npm install -g pcepbn
    
This will automatically download and install the most recent version
of the PCE PB N command line interface and install it globally (-g)
so that you can execute the following command from now on, everywhere:

    pcepbn
    
It should print the help screen of the program, like:
    
    PCE Instruments PB-N scale CLI -- v 0.1.0
    
    Lists of commands available in this version:
    
      help      Prints this help message
      discover  Detects PCE PB-N scales, outputs the device file(s)
      listen    Fetches the scales latest measurement value
    
    
### Installation Special Cases

If you see some error occurring like "EACCES", please ensure that
you didn't miss the "sudo" command at the beginning of the command line!
(You need to be root to install kernel drivers and "pcepbn" globally!)
    
#### Installation Special Cases: Mac OS X 
    
Please ensure that you have at a minimum the Xcode and Xcode Command Line Tools 
installed appropriate for your system configuration. If you recently 
upgraded the OS, it probably removed your installation of Command Line Tools, 
please verify before submitting a ticket.

To install xCode, open a terminal window (Cmd+Space, type "Terminal", hit "ENTER")
and execute the following command:

    gcc
    
If a installation prompt shows up, proceed with the installation of xCode and 
the xCode Command Line Tools by clicking the "Install" button. Re-run the 
"pcepbn" CLI installation.

#### Installation Special Cases: LINUX/UNIX

Please ensure that you have at a minimum the build environment essentials installed
like GCC, make, etc. pp. 

For Debian/Ubunu system you can install these tools via a single command:

    sudo apt-get install build-essential

## Untested: Support for Microsoft Windows / Get involved :)

The under-laying implementation, runtime and libraries should allow
this program to also run on Microsoft Windows 7, 8 and 8.1

- Install Visual Studio Express 2013 for Windows Desktop.
- Install node.js 0.10.x matching the bitness (32 or 64) of your operating system.
- Install Python 2.7.6 matching the bitness of your operating system. 
  For any questions, please refer to their FAQ. Default settings are perfect.
- Open the 'Visual Studio Command Prompt' and add Python to the path.

Then proceed with the installation of "pcepbn" using npm (see above).
Try to call the program using "node lib/pcepbn.js" and file a ticket
if you managed it / faced issues. Thanks :-)

## License

Copyright (c) 2015, Aron Homberg and the BeeMon development team.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.