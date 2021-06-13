# Image to start 
FROM node:14.17.0-buster

# Copy app source code to new directory 
COPY . /code/

# change to work directory 
WORKDIR /code

# Instal dependencies
RUN \
  apt update && \
  apt upgrade -y && \ 
  apt install -y python3-pip && \
  pip3 install supervisor && \
  npm i

# Port connection
EXPOSE 5000

# command for container initializer
CMD supervisord -c supervisor.conf &