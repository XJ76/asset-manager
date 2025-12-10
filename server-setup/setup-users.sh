#!/bin/bash

# Server Setup Script for E-Port Dev Task 2
# This script sets up users, SSH keys, and security configurations

set -e

echo "=== E-Port Server Setup Script ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get your name from user input (or use argument)
if [ -n "$1" ]; then
    YOUR_NAME="$1"
else
    read -p "Enter your name (for the first Linux username): " YOUR_NAME
fi

if [ -z "$YOUR_NAME" ]; then
    echo -e "${RED}Error: Name cannot be empty${NC}"
    exit 1
fi

# Convert name to lowercase and replace spaces with underscores
USERNAME=$(echo "$YOUR_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

echo ""
echo -e "${GREEN}Creating user: $USERNAME${NC}"

# Create first user with your name
if id "$USERNAME" &>/dev/null; then
    echo -e "${YELLOW}User $USERNAME already exists${NC}"
else
    useradd -m -s /bin/bash "$USERNAME"
    usermod -aG sudo "$USERNAME"
    echo -e "${GREEN}User $USERNAME created with sudo privileges${NC}"
fi

# Create eport user
EPORT_USER="eport"
if id "$EPORT_USER" &>/dev/null; then
    echo -e "${YELLOW}User $EPORT_USER already exists${NC}"
else
    useradd -m -s /bin/bash "$EPORT_USER"
    usermod -aG sudo "$EPORT_USER"
    echo -e "${GREEN}User $EPORT_USER created with sudo privileges${NC}"
fi

echo ""
echo -e "${GREEN}Setting up SSH keys...${NC}"

# Create .ssh directory for both users
mkdir -p /home/$USERNAME/.ssh
mkdir -p /home/$EPORT_USER/.ssh
chmod 700 /home/$USERNAME/.ssh
chmod 700 /home/$EPORT_USER/.ssh

# For your user - you'll need to add your public key
echo -e "${YELLOW}For user $USERNAME:${NC}"
echo "Please add your SSH public key to /home/$USERNAME/.ssh/authorized_keys"
echo "You can do this by:"
echo "  1. Copy your public key from your local machine"
echo "  2. Run: echo 'YOUR_PUBLIC_KEY' >> /home/$USERNAME/.ssh/authorized_keys"
echo ""

# For eport user - add the provided public key
EPORT_PUBLIC_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPL0Rq+HvMZRB7RlOuz7mTewt9/sfKy8sTV2f5XIhFqt eport@ubuntu"
echo "$EPORT_PUBLIC_KEY" > /home/$EPORT_USER/.ssh/authorized_keys
chmod 600 /home/$USERNAME/.ssh/authorized_keys
chmod 600 /home/$EPORT_USER/.ssh/authorized_keys
chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh
chown -R $EPORT_USER:$EPORT_USER /home/$EPORT_USER/.ssh

echo -e "${GREEN}SSH key for eport user configured${NC}"

echo ""
echo -e "${GREEN}Configuring SSH security...${NC}"

# Backup SSH config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Configure SSH to deny root login and disable password authentication
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Ensure these settings are set
if ! grep -q "^PermitRootLogin no" /etc/ssh/sshd_config; then
    echo "PermitRootLogin no" >> /etc/ssh/sshd_config
fi

if ! grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config; then
    echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
fi

# Test SSH config before restarting
if sshd -t; then
    systemctl restart sshd
    echo -e "${GREEN}SSH configuration updated and service restarted${NC}"
else
    echo -e "${RED}SSH configuration test failed. Restoring backup...${NC}"
    cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
    exit 1
fi

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Summary:"
echo "  - User $USERNAME created with sudo privileges"
echo "  - User $EPORT_USER created with sudo privileges"
echo "  - SSH key for eport user configured"
echo "  - SSH root login disabled"
echo "  - SSH password authentication disabled"
echo ""
echo -e "${YELLOW}IMPORTANT:${NC}"
echo "  1. Add your SSH public key to /home/$USERNAME/.ssh/authorized_keys"
echo "  2. Test SSH login for both users before logging out"
echo "  3. Keep the root session open until you verify SSH access"
echo ""

