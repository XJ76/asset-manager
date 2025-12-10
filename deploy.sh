#!/bin/bash

# Complete Automated Deployment Script for E-Port Dev Task 2
# This script automates the entire deployment process

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  E-Port Dev Task 2 - Auto Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Server details from email
SERVER_DOMAIN="server20.eport.ws"
EPORT_SSH_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPL0Rq+HvMZRB7RlOuz7mTewt9/sfKy8sTV2f5XIhFqt eport@ubuntu"

# Get user input
read -p "Enter your name (for Linux username): " YOUR_NAME
if [ -z "$YOUR_NAME" ]; then
    echo -e "${RED}Error: Name cannot be empty${NC}"
    exit 1
fi

read -p "Enter your email (for Let's Encrypt): " EMAIL
if [ -z "$EMAIL" ]; then
    echo -e "${RED}Error: Email cannot be empty${NC}"
    exit 1
fi

read -sp "Enter a strong password for PostgreSQL: " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32)
    echo -e "${YELLOW}Generated random password for database${NC}"
fi

read -sp "Enter a strong API key (or press Enter to generate): " API_KEY
echo ""
if [ -z "$API_KEY" ]; then
    API_KEY=$(openssl rand -base64 32)
    echo -e "${YELLOW}Generated random API key${NC}"
fi

# Convert name to username
USERNAME=$(echo "$YOUR_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

echo ""
echo -e "${GREEN}=== Step 1: Creating Users ===${NC}"

# Create users
if id "$USERNAME" &>/dev/null; then
    echo -e "${YELLOW}User $USERNAME already exists${NC}"
else
    useradd -m -s /bin/bash "$USERNAME"
    usermod -aG sudo "$USERNAME"
    echo -e "${GREEN}✓ User $USERNAME created${NC}"
fi

if id "eport" &>/dev/null; then
    echo -e "${YELLOW}User eport already exists${NC}"
else
    useradd -m -s /bin/bash eport
    usermod -aG sudo eport
    echo -e "${GREEN}✓ User eport created${NC}"
fi

echo ""
echo -e "${GREEN}=== Step 2: Configuring SSH ===${NC}"

# Setup SSH for both users
mkdir -p /home/$USERNAME/.ssh
mkdir -p /home/eport/.ssh
chmod 700 /home/$USERNAME/.ssh
chmod 700 /home/eport/.ssh

# Add eport SSH key
echo "$EPORT_SSH_KEY" > /home/eport/.ssh/authorized_keys
chmod 600 /home/eport/.ssh/authorized_keys
chown -R eport:eport /home/eport/.ssh

# Setup for your user (you'll add your key manually)
chmod 600 /home/$USERNAME/.ssh/authorized_keys 2>/dev/null || touch /home/$USERNAME/.ssh/authorized_keys
chmod 600 /home/$USERNAME/.ssh/authorized_keys
chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh

echo -e "${GREEN}✓ SSH keys configured${NC}"
echo -e "${YELLOW}⚠ Add your SSH public key to /home/$USERNAME/.ssh/authorized_keys${NC}"

echo ""
echo -e "${GREEN}=== Step 3: Securing SSH ===${NC}"

# Backup SSH config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)

# Configure SSH
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Ensure settings
grep -q "^PermitRootLogin no" /etc/ssh/sshd_config || echo "PermitRootLogin no" >> /etc/ssh/sshd_config
grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config || echo "PasswordAuthentication no" >> /etc/ssh/sshd_config

# Test and restart
if sshd -t; then
    systemctl restart sshd
    echo -e "${GREEN}✓ SSH secured${NC}"
else
    echo -e "${RED}SSH config test failed. Restoring backup...${NC}"
    cp /etc/ssh/sshd_config.backup.* /etc/ssh/sshd_config
    exit 1
fi

echo ""
echo -e "${GREEN}=== Step 4: Installing Docker ===${NC}"

if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker already installed${NC}"
else
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release
    
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    usermod -aG docker $USERNAME
    usermod -aG docker eport
    
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}✓ Docker installed${NC}"
fi

echo ""
echo -e "${GREEN}=== Step 5: Configuring Firewall ===${NC}"

# Install UFW if not present
if ! command -v ufw &> /dev/null; then
    apt-get install -y ufw
fi

# Configure firewall
ufw --force enable || true
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP - Let\'s Encrypt'
ufw allow 443/tcp comment 'HTTPS'
echo -e "${GREEN}✓ Firewall configured${NC}"

echo ""
echo -e "${GREEN}=== Step 6: Setting Up Application ===${NC}"

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$SCRIPT_DIR"

if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found in $APP_DIR${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

cd "$APP_DIR"

# Create environment file
if [ ! -f "warranty-register/.env" ]; then
    cat > warranty-register/.env <<EOF
DB_HOST=postgres
DB_NAME=warranty_db
DB_USER=warranty_user
DB_PASSWORD=$DB_PASSWORD
DB_PORT=5432

API_KEY=$API_KEY
ALLOWED_ORIGINS=https://$SERVER_DOMAIN

PORT=5000
FLASK_DEBUG=False
EOF
    echo -e "${GREEN}✓ Environment file created${NC}"
fi

# Update nginx config with server name
sed -i "s/server_name server20.eport.ws/server_name $SERVER_DOMAIN/g" nginx/conf.d/warranty.conf
echo -e "${GREEN}✓ Nginx config updated${NC}"

# Update docker-compose.yml with passwords
sed -i "s/DB_PASSWORD:-warranty_secure_password_2024/DB_PASSWORD:-$DB_PASSWORD/g" docker-compose.yml
sed -i "s/API_KEY:-warranty_api_key_secure_2024/API_KEY:-$API_KEY/g" docker-compose.yml
echo -e "${GREEN}✓ Docker Compose updated${NC}"

echo ""
echo -e "${GREEN}=== Step 7: Building and Starting Services ===${NC}"

# Create necessary directories
mkdir -p certbot/conf certbot/www
mkdir -p nginx/ssl

# Build and start
docker compose build
docker compose up -d

echo ""
echo -e "${GREEN}✓ Services started${NC}"

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check health
if docker compose exec -T warranty_api curl -f http://localhost:5000/health &>/dev/null; then
    echo -e "${GREEN}✓ API is healthy${NC}"
else
    echo -e "${YELLOW}⚠ API health check failed, but continuing...${NC}"
fi

echo ""
echo -e "${GREEN}=== Step 8: Setting Up SSL Certificate ===${NC}"

# Install certbot
if ! command -v certbot &> /dev/null; then
    apt-get update
    apt-get install -y certbot
fi

# Stop nginx temporarily
docker compose stop nginx

# Get certificate
echo -e "${YELLOW}Obtaining SSL certificate...${NC}"
certbot certonly --standalone \
    -d "$SERVER_DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive

if [ $? -eq 0 ]; then
    # Copy certificates
    cp -r "/etc/letsencrypt/live/$SERVER_DOMAIN" "certbot/conf/" 2>/dev/null || true
    cp -r "/etc/letsencrypt/archive/$SERVER_DOMAIN" "certbot/conf/archive/" 2>/dev/null || true
    
    # Set ownership
    chown -R $USERNAME:$USERNAME certbot/ 2>/dev/null || chown -R root:root certbot/
    
    echo -e "${GREEN}✓ SSL certificate obtained${NC}"
else
    echo -e "${RED}Failed to obtain SSL certificate${NC}"
    echo -e "${YELLOW}You can retry this step manually later${NC}"
fi

# Restart nginx
docker compose up -d nginx

echo ""
echo -e "${GREEN}=== Step 9: Final Verification ===${NC}"

# Check services
echo -e "${BLUE}Service Status:${NC}"
docker compose ps

echo ""
echo -e "${BLUE}Testing API...${NC}"
sleep 5

if curl -k -f "https://$SERVER_DOMAIN/health" &>/dev/null; then
    echo -e "${GREEN}✓ HTTPS API is accessible${NC}"
elif curl -f "http://localhost:5000/health" &>/dev/null; then
    echo -e "${YELLOW}⚠ HTTPS not ready yet, but HTTP API works${NC}"
    echo -e "${YELLOW}You may need to manually copy SSL certificates${NC}"
else
    echo -e "${YELLOW}⚠ API health check failed${NC}"
    echo -e "${YELLOW}Check logs: docker compose logs warranty_api${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT INFORMATION:${NC}"
echo ""
echo -e "Server Domain: ${GREEN}$SERVER_DOMAIN${NC}"
echo -e "Database Password: ${GREEN}$DB_PASSWORD${NC}"
echo -e "API Key: ${GREEN}$API_KEY${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Add your SSH public key to /home/$USERNAME/.ssh/authorized_keys"
echo "2. Test SSH login: ssh $USERNAME@$SERVER_DOMAIN"
echo "3. Test SSH login: ssh eport@$SERVER_DOMAIN"
echo "4. Update frontend environment variables:"
echo "   NEXT_PUBLIC_WARRANTY_API_URL=https://$SERVER_DOMAIN"
echo "   NEXT_PUBLIC_WARRANTY_API_KEY=$API_KEY"
echo "5. Test warranty registration from frontend"
echo ""
echo -e "${YELLOW}Optional (for extra marks):${NC}"
echo "Close port 80: sudo ufw delete allow 80/tcp"
echo ""
echo -e "${BLUE}View logs: docker compose logs -f${NC}"
echo -e "${BLUE}Check status: docker compose ps${NC}"
echo ""

