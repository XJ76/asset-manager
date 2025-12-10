#!/bin/bash

# Complete Setup Script - Run this on the server as root
# This script does EVERYTHING automatically

set -e

echo "=========================================="
echo "  E-Port Dev Task 2 - Complete Setup"
echo "=========================================="
echo ""

# Server details from email
SERVER_DOMAIN="server20.eport.ws"
EPORT_SSH_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPL0Rq+HvMZRB7RlOuz7mTewt9/sfKy8sTV2f5XIhFqt eport@ubuntu"

# Get user input
read -p "Enter your name (for Linux username): " YOUR_NAME
read -p "Enter your email (for Let's Encrypt): " EMAIL

# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
API_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

USERNAME=$(echo "$YOUR_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

echo ""
echo "Setting up users..."
./server-setup/setup-users.sh <<EOF
$YOUR_NAME
EOF

echo ""
echo "Installing Docker..."
./server-setup/setup-docker.sh

echo ""
echo "Configuring firewall..."
./server-setup/setup-firewall.sh <<EOF
n
EOF

echo ""
echo "Creating environment file..."
cat > warranty-register/.env <<ENVFILE
DB_HOST=postgres
DB_NAME=warranty_db
DB_USER=warranty_user
DB_PASSWORD=$DB_PASSWORD
DB_PORT=5432

API_KEY=$API_KEY
ALLOWED_ORIGINS=https://$SERVER_DOMAIN

PORT=5000
FLASK_DEBUG=False
ENVFILE

echo ""
echo "Updating configurations..."
sed -i "s/server20.eport.ws/$SERVER_DOMAIN/g" nginx/conf.d/warranty.conf
sed -i "s/DB_PASSWORD:-warranty_secure_password_2024/DB_PASSWORD:-$DB_PASSWORD/g" docker-compose.yml
sed -i "s/API_KEY:-warranty_api_key_secure_2024/API_KEY:-$API_KEY/g" docker-compose.yml

echo ""
echo "Creating directories..."
mkdir -p certbot/conf certbot/www nginx/ssl

echo ""
echo "Building and starting Docker containers..."
docker compose build
docker compose up -d

echo ""
echo "Waiting for services..."
sleep 15

echo ""
echo "Setting up SSL certificate..."
docker compose stop nginx
apt-get update -qq
apt-get install -y certbot

certbot certonly --standalone \
    -d "$SERVER_DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive

cp -r "/etc/letsencrypt/live/$SERVER_DOMAIN" certbot/conf/ 2>/dev/null || true
chown -R $USER:$USER certbot/ 2>/dev/null || true

docker compose up -d

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Database Password: $DB_PASSWORD"
echo "API Key: $API_KEY"
echo ""
echo "Add these to your frontend:"
echo "NEXT_PUBLIC_WARRANTY_API_URL=https://$SERVER_DOMAIN"
echo "NEXT_PUBLIC_WARRANTY_API_KEY=$API_KEY"
echo ""

