#!/bin/bash

pushd . > /dev/null

SCRIPT_PATH="${BASH_SOURCE[0]}";
if ([ -h "${SCRIPT_PATH}" ]) then
  while([ -h "${SCRIPT_PATH}" ]) do cd `dirname "$SCRIPT_PATH"`; SCRIPT_PATH=`readlink "${SCRIPT_PATH}"`; done
fi
cd `dirname ${SCRIPT_PATH}` > /dev/null
SCRIPT_PATH=`pwd`;

popd  > /dev/null

# use nodejs executable if available
if nodejs -v >/dev/null 2>&1; then
    nodejs $SCRIPT_PATH/bin/pcepbn.js "$@"
    exit 0
elif node -v >/dev/null 2>&1;
then
    # use node executable if nodejs isn't available
    node $SCRIPT_PATH/bin/pcepbn.js "$@"
    exit 0
else
    echo "No Node.js executable found. Please fix your Node.js installation."
fi