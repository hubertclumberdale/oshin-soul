#!/bin/bash

# Function to install npm packages and start the application
run_app() {
  echo "Nodemon: Running npm install..."
  npm install

  echo "Nodemon: Starting the application..."
  npm start
}

# Initial run
run_app

# Watch for changes to package.json and restart the application using Nodemon
nodemon --watch package.json --exec run_app