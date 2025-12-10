#!/bin/bash

# Docker Installation and Setup Script

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=== Docker Installation ==="
echo ""

# Update package index
echo -e "${GREEN}Updating package index...${NC}"
apt-get update

# Install prerequisites
echo -e "${GREEN}Installing prerequisites...${NC}"
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
echo -e "${GREEN}Adding Docker GPG key...${NC}"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo -e "${GREEN}Setting up Docker repository...${NC}"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
echo -e "${GREEN}Installing Docker Engine...${NC}"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to docker group (if not root)
if [ "$SUDO_USER" ]; then
    echo -e "${GREEN}Adding $SUDO_USER to docker group...${NC}"
    usermod -aG docker $SUDO_USER
fi

# Start and enable Docker
echo -e "${GREEN}Starting Docker service...${NC}"
systemctl start docker
systemctl enable docker

# Verify installation
echo ""
echo -e "${GREEN}Verifying Docker installation...${NC}"
docker --version
docker compose version

echo ""
echo -e "${GREEN}Docker installation complete!${NC}"
echo -e "${YELLOW}Note: You may need to log out and back in for group changes to take effect.${NC}"

