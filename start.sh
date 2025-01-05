#!/bin/sh

# echo "Preparing nginx configuration..."
# proxymanager nginx init
echo "Starting nginx..."
proxymanager & nginx -g 'daemon off;'