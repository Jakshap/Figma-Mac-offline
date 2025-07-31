#!/bin/bash

# Check if server is already running
if curl -s http://localhost:3001/api/colors > /dev/null 2>&1; then
    echo "Server is already running on port 3001"
    exit 0
fi

# Start the server
echo "Starting server..."
cd "/Users/jackshapiro/Desktop/!Figma"
npm start &

# Wait for server to start
sleep 3

# Check if it started successfully
if curl -s http://localhost:3001/api/colors > /dev/null 2>&1; then
    echo "Server started successfully!"
else
    echo "Failed to start server"
    exit 1
fi