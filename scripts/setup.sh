#!/bin/bash

# Setup Script for Node.js App on AWS Lightsail (Ubuntu)

set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting setup process...${NC}"

# 1. Update System
echo -e "${GREEN}Updating system packages...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js (LTS)
echo -e "${GREEN}Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed."
fi

# 3. Install PM2
echo -e "${GREEN}Installing PM2...${NC}"
sudo npm install -g pm2

# 4. Install Nginx
echo -e "${GREEN}Installing Nginx...${NC}"
sudo apt-get install -y nginx

# 5. Setup Firewall (UFW)
echo -e "${GREEN}Configuring Firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 6. Install Certbot
echo -e "${GREEN}Installing Certbot...${NC}"
sudo apt-get install -y certbot python3-certbot-nginx

# 7. Setup App
echo -e "${GREEN}Setting up application...${NC}"
npm ci

# 8. Start App with PM2
echo -e "${GREEN}Starting application with PM2...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup | tail -n 1 | bash || echo "Please run the command output by 'pm2 startup' manually if this failed."

echo -e "${GREEN}Setup complete!${NC}"
echo "Next steps:"
echo "1. Configure your .env file."
echo "2. Configure Nginx reverse proxy (see deployment_guide.md)."
echo "3. Run 'sudo certbot --nginx' to enable SSL after configuring Nginx."
