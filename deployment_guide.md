# AWS Lightsail Deployment Guide

This guide describes how to deploy the Clash Royale API Proxy to an AWS Lightsail instance (Ubuntu).

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **Domain Name (Optional but Recommended)**: A domain pointing to your Lightsail instance's static IP if you want HTTPS.

## 1. Prepare the Instance

1.  Log in to your Lightsail instance console or use SSH.
2.  Clone this repository to your server (you've already done this).
    ```bash
    cd deck-ai-backend
    ```

## 2. Run the Setup Script

We have provided a script to automate dependency installation (Node.js, Nginx, PM2, Certbot) and firewall configuration.

1.  Make the script executable:
    ```bash
    chmod +x scripts/setup.sh
    ```
2.  Run the script:
    ```bash
    ./scripts/setup.sh
    ```

## 3. Configuration

### Environment Variables
1.  Copy the example env file:
    ```bash
    cp .env.example .env
    ```
2.  Edit `.env` with your real API keys:
    ```bash
    nano .env
    ```

### Nginx Reverse Proxy
To make your app accessible via port 80/443 instead of 3000.

1.  Create a new Nginx config file (replace `yourdomain.com` with your domain or public IP):
    ```bash
    sudo nano /etc/nginx/sites-available/clash-royale-api
    ```
2.  Paste the following configuration:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com; # Or your Public IP

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  Enable the configuration:
    ```bash
    sudo ln -s /etc/nginx/sites-available/clash-royale-api /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 4. Enable HTTPS (SSL)

If you have a domain name pointing to your server:

```bash
sudo certbot --nginx
```
Follow the prompts to auto-configure SSL.

## 5. Management Commands

- **Restart App**: `pm2 restart clash-royale-api`
- **View Logs**: `pm2 logs`
- **Monitor**: `pm2 monit`
