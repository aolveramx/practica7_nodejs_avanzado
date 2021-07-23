#!/bin/bash

#download node & npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
.~/.nvm/nvm.sh
nvm install node

#create our working directory if it doesn't exist
DIR="/home/node/node_app"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi