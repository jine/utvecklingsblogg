#!/bin/sh
# Docker entrypoint script for utvecklingsblogg
# Ensures correct permissions for uploaded images directory

set -e

# Create uploads directory if it doesn't exist
mkdir -p /app/public/uploads/images

# Fix ownership to node user (UID 1000)
# This is needed because Docker volume mounts may create directories as root
chown -R node:node /app/public/uploads

# Switch to node user and execute the main command
exec gosu node "$@"
