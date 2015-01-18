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
if node -v >/dev/null 2>&1; then
    node $SCRIPT_PATH/bin/pcepbn.js $1 $2 $3 $4 $5
    exit 0
fi

# use nodejs executable if available
if nodejs -v >/dev/null 2>&1; then
    nodejs $SCRIPT_PATH/bin/pcepbn.js $1 $2 $3 $4 $5
    exit 0
fi