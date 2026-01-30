# 🚀 AWS EC2 Free Tier Deployment Guide

Complete step-by-step guide to deploy your Finsure Docker application on AWS EC2 Free Tier with custom domain setup.

---

## 📋 Table of Contents

1. [AWS Account Setup](#1-aws-account-setup)
2. [EC2 Instance Creation](#2-ec2-instance-creation)
3. [Server Configuration](#3-server-configuration)
4. [Docker Installation](#4-docker-installation)
5. [Deploy Application](#5-deploy-application)
6. [Domain & DNS Configuration](#6-domain--dns-configuration)
7. [SSL/TLS Setup (HTTPS)](#7-ssltls-setup-https)
8. [Monitoring & Maintenance](#8-monitoring--maintenance)

---

## 1. AWS Account Setup

### **Step 1.1: Create AWS Account**

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Fill in:
   - Email address
   - Password
   - AWS account name (e.g., "Finsure Production")
4. Choose **"Personal"** account type
5. Enter payment information (required, but Free Tier won't charge you)
6. Verify phone number via SMS/call
7. Choose **"Basic Support - Free"** plan

### **Step 1.2: Enable MFA (Multi-Factor Authentication)**

⚠️ **CRITICAL for security:**

1. Sign in to AWS Console
2. Click your account name (top right) → **Security Credentials**
3. Under **"Multi-factor authentication (MFA)"**, click **"Assign MFA device"**
4. Choose **"Virtual MFA device"**
5. Use Google Authenticator or Authy app to scan QR code
6. Enter two consecutive MFA codes

### **Step 1.3: Create IAM User (Best Practice)**

Instead of using root account:

1. Go to **IAM** service (search in top bar)
2. Click **"Users"** → **"Add users"**
3. Username: `finsure-admin`
4. Check **"Provide user access to AWS Management Console"**
5. Choose **"I want to create an IAM user"**
6. Set custom password
7. Click **"Next"**
8. Attach policies:
   - `AmazonEC2FullAccess`
   - `AmazonRoute53FullAccess` (for DNS)
9. Click **"Create user"**
10. **Save the sign-in URL** (e.g., `https://123456789012.signin.aws.amazon.com/console`)

---

## 2. EC2 Instance Creation

### **Step 2.1: Launch EC2 Instance**

1. Go to **EC2** service (search in top bar)
2. Click **"Launch Instance"**

### **Step 2.2: Configure Instance**

#### **Name and Tags:**
```
Name: finsure-production
Environment: production
```

#### **Application and OS Images (AMI):**
- **Quick Start:** Ubuntu
- **AMI:** Ubuntu Server 24.04 LTS (Free tier eligible)
- **Architecture:** 64-bit (x86)

#### **Instance Type:**
- **Type:** `t2.micro` (Free tier eligible)
- **vCPUs:** 1
- **Memory:** 1 GiB
- ✅ Check "Free tier eligible" label

#### **Key Pair (Login):**
1. Click **"Create new key pair"**
2. Key pair name: `finsure-ec2-key`
3. Key pair type: **RSA**
4. Private key file format: **`.pem`** (for Mac/Linux) or **`.ppk`** (for Windows/PuTTY)
5. Click **"Create key pair"**
6. **⚠️ SAVE THIS FILE SECURELY** - you can't download it again!
7. Move to safe location:
   ```bash
   # Mac/Linux
   mv ~/Downloads/finsure-ec2-key.pem ~/.ssh/
   chmod 400 ~/.ssh/finsure-ec2-key.pem
   
   # Windows (PowerShell)
   Move-Item "$env:USERPROFILE\Downloads\finsure-ec2-key.pem" "$env:USERPROFILE\.ssh\"
   ```

#### **Network Settings:**
Click **"Edit"** and configure:

1. **VPC:** Default VPC
2. **Subnet:** No preference
3. **Auto-assign public IP:** Enable
4. **Firewall (Security Groups):** Create new security group
   - **Security group name:** `finsure-sg`
   - **Description:** Security group for Finsure application

**Security Group Rules:**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access (your IP only) |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | TCP | 3001 | 0.0.0.0/0 | Backend API (optional, for testing) |

⚠️ **Security Note:** For SSH, use "My IP" instead of "0.0.0.0/0" to restrict access to your IP only.

#### **Configure Storage:**
- **Size:** 8 GiB (Free tier: up to 30 GiB)
- **Volume Type:** gp3 (General Purpose SSD)
- **Delete on termination:** Yes (default)

**Recommended: Increase to 20 GiB** for Docker images and logs.

#### **Advanced Details:**
- Leave defaults (not needed for basic setup)

### **Step 2.3: Launch Instance**

1. Review all settings
2. Click **"Launch instance"**
3. Wait 2-3 minutes for instance to start
4. Click **"View all instances"**

### **Step 2.4: Note Your Instance Details**

Once instance is running, note:
- **Instance ID:** `i-0123456789abcdef0`
- **Public IPv4 address:** `54.123.45.67` (example)
- **Public IPv4 DNS:** `ec2-54-123-45-67.compute-1.amazonaws.com`

---

## 3. Server Configuration

### **Step 3.1: Connect to EC2 Instance**

#### **Option A: SSH from Mac/Linux/Windows (PowerShell)**

```bash
# Replace with your key file and public IP
ssh -i ~/.ssh/finsure-ec2-key.pem ubuntu@54.123.45.67
```

If you get "Permission denied":
```bash
chmod 400 ~/.ssh/finsure-ec2-key.pem
```

#### **Option B: AWS Console Browser-Based SSH**

1. Go to EC2 → Instances
2. Select your instance
3. Click **"Connect"** button
4. Choose **"EC2 Instance Connect"** tab
5. Click **"Connect"**

### **Step 3.2: Update System**

```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim htop
```

### **Step 3.3: Configure Firewall (UFW)**

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (IMPORTANT: do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow backend API (optional, for testing)
sudo ufw allow 3001/tcp

# Check status
sudo ufw status
```

---

## 4. Docker Installation

### **Step 4.1: Install Docker**

```bash
# Install Docker's official GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### **Step 4.2: Configure Docker Permissions**

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Apply group changes (or logout/login)
newgrp docker

# Test Docker without sudo
docker ps
```

### **Step 4.3: Enable Docker on Boot**

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 5. Deploy Application

### **Step 5.1: Transfer Code to EC2**

#### **Option A: Git Clone (Recommended)**

```bash
# Create app directory
mkdir -p ~/apps
cd ~/apps

# Clone your repository
git clone https://github.com/yourusername/finsure-wp.git
cd finsure-wp
```

#### **Option B: SCP (Copy from Local)**

From your **local machine**:

```bash
# Compress your project
cd /path/to/finsure-wp
tar -czf finsure-wp.tar.gz --exclude=node_modules --exclude=.git .

# Copy to EC2
scp -i ~/.ssh/finsure-ec2-key.pem finsure-wp.tar.gz ubuntu@54.123.45.67:~/

# On EC2, extract
ssh -i ~/.ssh/finsure-ec2-key.pem ubuntu@54.123.45.67
mkdir -p ~/apps/finsure-wp
cd ~/apps/finsure-wp
tar -xzf ~/finsure-wp.tar.gz
```

### **Step 5.2: Create Production .env File**

```bash
cd ~/apps/finsure-wp

# Create .env file
nano .env
```

**Paste this configuration:**

```env
# Frontend - Gemini API
VITE_GEMINI_API_KEY=AIzaSyBeBpKbjRZLbYfXgHprOOwrQnEfv5FKvTs
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent
VITE_API_URL=

# Backend Configuration
PORT=3001
NODE_ENV=production

# Generate strong JWT secret
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-generated-secret-here-replace-this

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword123!

# CORS - Set to your domain
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

### **Step 5.3: Generate Strong JWT Secret**

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and update JWT_SECRET in .env
nano .env
```

### **Step 5.4: Build and Start Docker Containers**

```bash
cd ~/apps/finsure-wp

# Build and start containers
docker compose up -d --build

# This will:
# 1. Build backend image (~2-3 minutes)
# 2. Build frontend image (~3-5 minutes)
# 3. Start both containers
```

### **Step 5.5: Verify Deployment**

```bash
# Check container status
docker compose ps

# Expected output:
# NAME                STATUS              PORTS
# finsure-backend     Up (healthy)        0.0.0.0:3001->3001/tcp
# finsure-frontend    Up (healthy)        0.0.0.0:80->80/tcp

# Check logs
docker compose logs -f

# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost/
```

### **Step 5.6: Access Your Application**

Open browser and visit:
- **Frontend:** `http://54.123.45.67` (your EC2 public IP)
- **Backend API:** `http://54.123.45.67:3001/health`

---

## 6. Domain & DNS Configuration

### **Step 6.1: Purchase Domain (if needed)**

Popular registrars:
- **Namecheap** (recommended, cheap)
- **GoDaddy**
- **Google Domains**
- **AWS Route 53** (more expensive)

Example: Buy `finsure.com` for ~$10-15/year

### **Step 6.2: Option A - Using AWS Route 53 (Recommended)**

#### **Create Hosted Zone:**

1. Go to **Route 53** service
2. Click **"Create hosted zone"**
3. **Domain name:** `finsure.com`
4. **Type:** Public hosted zone
5. Click **"Create hosted zone"**
6. **Note the 4 nameservers** (e.g., `ns-123.awsdns-12.com`)

#### **Update Domain Nameservers:**

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Find **"Nameservers"** or **"DNS Settings"**
3. Choose **"Custom nameservers"**
4. Enter the 4 AWS nameservers from Route 53
5. Save (propagation takes 1-48 hours, usually < 1 hour)

#### **Create DNS Records:**

Back in Route 53 → Your hosted zone:

**A Record (Root Domain):**
1. Click **"Create record"**
2. **Record name:** Leave empty (for `finsure.com`)
3. **Record type:** A
4. **Value:** Your EC2 public IP (e.g., `54.123.45.67`)
5. **TTL:** 300 seconds
6. Click **"Create records"**

**A Record (www subdomain):**
1. Click **"Create record"**
2. **Record name:** `www`
3. **Record type:** A
4. **Value:** Your EC2 public IP (e.g., `54.123.45.67`)
5. **TTL:** 300 seconds
6. Click **"Create records"**

**Alternative: CNAME Record for www:**
1. Click **"Create record"**
2. **Record name:** `www`
3. **Record type:** CNAME
4. **Value:** `finsure.com`
5. **TTL:** 300 seconds
6. Click **"Create records"**

### **Step 6.3: Option B - Using External DNS Provider**

If using Namecheap, GoDaddy, Cloudflare, etc.:

1. Go to your domain's DNS management
2. Create **A Record**:
   - **Host:** `@` (root domain)
   - **Value:** Your EC2 IP (e.g., `54.123.45.67`)
   - **TTL:** Automatic or 300
3. Create **A Record** or **CNAME** for www:
   - **Host:** `www`
   - **Value:** Your EC2 IP or `finsure.com`
   - **TTL:** Automatic or 300

### **Step 6.4: Verify DNS Propagation**

```bash
# Check DNS resolution (from your local machine)
nslookup finsure.com
dig finsure.com

# Online tools:
# https://dnschecker.org
# https://www.whatsmydns.net
```

Wait 5-60 minutes for DNS to propagate globally.

### **Step 6.5: Test Domain Access**

Once DNS propagates:
```
http://finsure.com
http://www.finsure.com
```

---

## 7. SSL/TLS Setup (HTTPS)

### **Step 7.1: Install Certbot**

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

### **Step 7.2: Update Nginx Configuration**

Since we're using Docker, we need to modify the approach:

#### **Option A: Certbot with Docker Nginx (Advanced)**

Create a new nginx config that includes SSL:

```bash
cd ~/apps/finsure-wp

# Backup original
cp nginx.conf nginx.conf.backup

# Edit nginx.conf
nano nginx.conf
```

Add server block for SSL (we'll get cert first):

```nginx
server {
    listen 80;
    server_name finsure.com www.finsure.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name finsure.com www.finsure.com;
    
    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/finsure.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/finsure.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Reverse proxy for backend API
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint proxy
    location /health {
        proxy_pass http://backend:3001/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Handle client-side routing for React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

#### **Option B: Use Reverse Proxy on Host (Recommended)**

Install Nginx on EC2 host (outside Docker) to handle SSL:

```bash
# Install Nginx on host
sudo apt install -y nginx

# Stop default nginx
sudo systemctl stop nginx

# Create new config
sudo nano /etc/nginx/sites-available/finsure
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name finsure.com www.finsure.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/finsure /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### **Step 7.3: Obtain SSL Certificate**

```bash
# Get certificate (Certbot will auto-configure Nginx)
sudo certbot --nginx -d finsure.com -d www.finsure.com

# Follow prompts:
# 1. Enter email address
# 2. Agree to Terms of Service (Y)
# 3. Share email with EFF (optional, Y/N)
# 4. Choose redirect option: 2 (Redirect HTTP to HTTPS)
```

### **Step 7.4: Auto-Renewal Setup**

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically creates a cron job
# Check it:
sudo systemctl status certbot.timer
```

### **Step 7.5: Verify HTTPS**

Visit:
```
https://finsure.com
https://www.finsure.com
```

Check SSL certificate:
- Click padlock icon in browser
- Should show "Let's Encrypt" certificate
- Valid for 90 days (auto-renews)

---

## 8. Monitoring & Maintenance

### **Step 8.1: Monitor Docker Containers**

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f

# View resource usage
docker stats

# Restart containers
docker compose restart

# Stop containers
docker compose down

# Start containers
docker compose up -d
```

### **Step 8.2: Update Application**

```bash
cd ~/apps/finsure-wp

# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Or rebuild specific service
docker compose up -d --build frontend
```

### **Step 8.3: Backup Strategy**

```bash
# Create backup script
nano ~/backup.sh
```

**Paste:**

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup .env file
cp ~/apps/finsure-wp/.env $BACKUP_DIR/env_$DATE

# Backup docker-compose.yml
cp ~/apps/finsure-wp/docker-compose.yml $BACKUP_DIR/docker-compose_$DATE.yml

# Create tarball of entire app
tar -czf $BACKUP_DIR/finsure_$DATE.tar.gz ~/apps/finsure-wp

# Keep only last 7 backups
ls -t $BACKUP_DIR/finsure_*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: $BACKUP_DIR/finsure_$DATE.tar.gz"
```

**Make executable and run:**

```bash
chmod +x ~/backup.sh
./backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /home/ubuntu/backup.sh
```

### **Step 8.4: Monitor Disk Space**

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up unused Docker resources
docker system prune -a
```

### **Step 8.5: Security Updates**

```bash
# Update system packages weekly
sudo apt update && sudo apt upgrade -y

# Update Docker images
cd ~/apps/finsure-wp
docker compose pull
docker compose up -d
```

### **Step 8.6: CloudWatch Monitoring (Optional)**

1. Go to **CloudWatch** service
2. Click **"Alarms"** → **"Create alarm"**
3. Select metric: **EC2 → Per-Instance Metrics**
4. Choose your instance
5. Select **CPUUtilization**
6. Set threshold: > 80% for 5 minutes
7. Create SNS topic for email notifications

---

## 📊 Cost Breakdown (Free Tier)

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| **EC2 t2.micro** | 750 hours/month (1 instance 24/7) | ~$8-10/month |
| **EBS Storage** | 30 GB | $0.10/GB/month |
| **Data Transfer** | 15 GB out/month | $0.09/GB |
| **Route 53** | $0.50/hosted zone/month | Same |
| **Total (Free Tier)** | ~$0.50/month | ~$15-20/month |

**Free Tier Duration:** 12 months from AWS account creation

---

## 🔒 Security Best Practices

1. ✅ **Never use root account** - Use IAM user
2. ✅ **Enable MFA** - On root and IAM users
3. ✅ **Restrict SSH** - Use "My IP" in security group
4. ✅ **Use strong passwords** - For admin login
5. ✅ **Rotate JWT secrets** - Periodically
6. ✅ **Enable HTTPS** - Always use SSL/TLS
7. ✅ **Update regularly** - System and Docker images
8. ✅ **Monitor logs** - Check for suspicious activity
9. ✅ **Backup regularly** - Automated daily backups
10. ✅ **Use environment variables** - Never hardcode secrets

---

## 🐛 Troubleshooting

### **Can't connect to EC2:**
```bash
# Check security group allows SSH from your IP
# Verify key permissions
chmod 400 ~/.ssh/finsure-ec2-key.pem
```

### **Docker containers not starting:**
```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Restart Docker
sudo systemctl restart docker
```

### **Domain not resolving:**
```bash
# Check DNS propagation
nslookup finsure.com

# Wait 1-24 hours for propagation
```

### **SSL certificate errors:**
```bash
# Renew certificate
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## ✅ Deployment Checklist

- [ ] AWS account created with MFA enabled
- [ ] IAM user created with proper permissions
- [ ] EC2 instance launched (t2.micro)
- [ ] Security group configured (ports 22, 80, 443)
- [ ] SSH key pair downloaded and secured
- [ ] Connected to EC2 instance via SSH
- [ ] System updated and Docker installed
- [ ] Application code transferred to EC2
- [ ] `.env` file created with production values
- [ ] Strong JWT secret generated
- [ ] Admin password changed from default
- [ ] Docker containers built and running
- [ ] Application accessible via EC2 public IP
- [ ] Domain purchased (if needed)
- [ ] DNS records created (A/CNAME)
- [ ] DNS propagation verified
- [ ] SSL certificate obtained via Certbot
- [ ] HTTPS working correctly
- [ ] CORS configured for production domain
- [ ] Backup script created and scheduled
- [ ] Monitoring set up (CloudWatch)

---

**🎉 Congratulations! Your application is now live on AWS EC2!**

Visit: `https://yourdomain.com`
