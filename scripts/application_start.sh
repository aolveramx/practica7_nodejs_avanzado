#!/bin/bash
sudo chmod -R 777 /home/node/node_app

cd /home/node/node_app

#add npm and node to path
export NVM_DIR="$HOME/.sh"
[ -s "NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" #loads nvm
[ -s "NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" #loads nvm bash_completion

npm install

#start our node app in the background
node server.js > server.out.log 2> server.err.log < /dev/null & 