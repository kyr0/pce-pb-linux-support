#!/bin/sh

# use nodejs executable if available
if node -v >/dev/null 2>&1; then
    node ./bin/pcepbn.js $1 $2 $3 $4 $5
    exit 0
fi

# use nodejs executable if available
if nodejs -v >/dev/null 2>&1; then
    nodejs ./bin/pcepbn.js $1 $2 $3 $4 $5
    exit 0
fi