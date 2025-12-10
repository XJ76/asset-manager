#!/bin/bash

# Firewall Setup Script
# Configures UFW to allow ports 22, 80, 443 and optionally close port 80 after setup

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=== Firewall Configuration ==="
echo ""

# Enable UFW if not already enabled
if ! ufw status | grep -q "Status: active"; then
    echo -e "${GREEN}Enabling UFW...${NC}"
    ufw --force enable
fi

# Allow SSH (port 22)
echo -e "${GREEN}Allowing SSH (port 22)...${NC}"
ufw allow 22/tcp comment 'SSH'

# Allow HTTP (port 80) - needed for Let's Encrypt
echo -e "${GREEN}Allowing HTTP (port 80) for Let's Encrypt...${NC}"
ufw allow 80/tcp comment 'HTTP - Let's Encrypt'

# Allow HTTPS (port 443)
echo -e "${GREEN}Allowing HTTPS (port 443)...${NC}"
ufw allow 443/tcp comment 'HTTPS'

# Show status
echo ""
echo -e "${GREEN}Current firewall status:${NC}"
ufw status numbered

echo ""
# Check if running non-interactively
if [ -t 0 ]; then
    read -p "Do you want to close port 80 now? (y/N): " -n 1 -r
    echo
    CLOSE_PORT80=$REPLY
else
    CLOSE_PORT80="n"
fi

if [[ $CLOSE_PORT80 =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Closing port 80...${NC}"
    ufw delete allow 80/tcp
    echo -e "${GREEN}Port 80 closed. All traffic must use HTTPS.${NC}"
else
    echo -e "${YELLOW}Port 80 remains open. You can close it later with:${NC}"
    echo "  sudo ufw delete allow 80/tcp"
fi

echo ""
echo -e "${GREEN}Firewall configuration complete${NC}"

