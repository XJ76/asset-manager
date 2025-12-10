#!/bin/bash

# SSL Certificate Setup Script
# This script helps obtain and configure Let's Encrypt certificates

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=== SSL Certificate Setup ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Get server domain
read -p "Enter your server domain (e.g., server20.eport.ws): " SERVER_DOMAIN
if [ -z "$SERVER_DOMAIN" ]; then
    echo -e "${RED}Error: Domain cannot be empty${NC}"
    exit 1
fi

# Get email
read -p "Enter your email for Let's Encrypt: " EMAIL
if [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: Email cannot be empty${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Stopping Nginx container...${NC}"
cd /opt/warranty-register || cd "$(dirname "$0")/.."
docker compose stop nginx || true

echo ""
echo -e "${GREEN}Installing Certbot...${NC}"
apt-get update
apt-get install -y certbot

echo ""
echo -e "${GREEN}Obtaining SSL certificate...${NC}"
certbot certonly --standalone \
  -d "$SERVER_DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Certificate obtained successfully!${NC}"
    
    # Create certbot directories if they don't exist
    mkdir -p certbot/conf/live
    mkdir -p certbot/conf/archive
    
    # Copy certificates
    echo -e "${GREEN}Copying certificates...${NC}"
    cp -r "/etc/letsencrypt/live/$SERVER_DOMAIN" "certbot/conf/live/"
    cp -r "/etc/letsencrypt/archive/$SERVER_DOMAIN" "certbot/conf/archive/"
    
    # Set ownership
    chown -R "$SUDO_USER:$SUDO_USER" certbot/ || chown -R "$USER:$USER" certbot/
    
    echo ""
    echo -e "${GREEN}Certificates copied to certbot/conf/${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Verify nginx/conf.d/warranty.conf has the correct server_name"
    echo "2. Start services: docker compose up -d"
    echo "3. Test: curl https://$SERVER_DOMAIN/health"
else
    echo -e "${RED}Failed to obtain certificate${NC}"
    exit 1
fi

