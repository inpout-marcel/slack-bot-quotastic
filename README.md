# Quotastic (by Build To Sell B.V.)

A fun Slack bot to save your team's best quotes! 💬

## Features

- **`/quote store [text]`** - Save a new quote
- **`/quote random`** - Get a random quote
- **`/quote list`** - View the last 5 quotes
- **`/quote delete [ID]`** - Delete a quote (only for the person who added it or the person quoted)

## Local Installation

### Requirements
- Node.js (v14 or higher)
- npm or yarn
- A Slack workspace where you can install apps

### Step 1: Clone the project

```bash
git clone <repository-url>
cd quotastic
npm install
```

### Step 2: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From an app manifest"
4. Select your workspace
5. Paste the contents of `manifest.json`
6. Click "Create"

### Step 3: Configure the app

#### Get your tokens:

1. **Signing Secret**
   - Go to "Basic Information"
   - Find "Signing Secret" under App Credentials
   - Click "Show" and copy the secret

2. **Bot Token**
   - Go to "OAuth & Permissions" in the sidebar
   - Click "Install to Workspace" button
   - Authorize the app
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)

3. **App Token** (for Socket Mode)
   - Go to "Basic Information" > "App-Level Tokens"
   - Click "Generate Token and Scopes"
   - Give the token a name (e.g. "socket-mode")
   - Add the scope `connections:write`
   - Click "Generate"
   - Copy the token (starts with `xapp-`)

### Step 4: Environment variables

1. Copy `.env.example` to `.env`
2. Fill in the tokens:

```env
# Required Slack tokens
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token

# Optional settings (not needed for Glitch)
NODE_ENV=development
PORT=3000
```

### Step 5: Start the app

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Deployment Options

### Glitch

1. Go to [glitch.com](https://glitch.com)
2. Click "New Project" > "Import from GitHub"
3. Paste your repository URL
4. Add environment variables:
   - Click on the `.env` file in Glitch editor
   - Add only the required tokens:
     ```
     SLACK_BOT_TOKEN=xoxb-your-bot-token
     SLACK_SIGNING_SECRET=your-signing-secret
     SLACK_APP_TOKEN=xapp-your-app-token
     ```
   - Note: NODE_ENV and PORT are automatically managed by Glitch
5. Your app runs automatically!

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Add environment variables via the Vercel dashboard

### Heroku

1. Create a new Heroku app
2. Connect to your GitHub repository
3. Add environment variables via Settings > Config Vars
4. Deploy!

### Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Click "Deploy"

### Ubuntu 24 Server (Own VPS/Server)

#### Requirements
- Ubuntu 24.04 LTS server
- SSH access to your server
- Domain name (optional, for HTTPS)

#### Step 1: Prepare the server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install build tools
sudo apt-get install -y build-essential

# Install PM2 (process manager)
sudo npm install -g pm2

# Create a user for the app (optional but recommended)
sudo useradd -m -s /bin/bash quotastic
sudo usermod -aG sudo quotastic
```

#### Step 2: Clone and install the app

```bash
# Login as quotastic user (or use your own user)
sudo su - quotastic

# Clone the repository
git clone <repository-url> /home/quotastic/app
cd /home/quotastic/app

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env  # Fill in your Slack tokens here
```

#### Step 3: Start the app with PM2

```bash
# Start the app
pm2 start index.js --name quotastic

# Save PM2 configuration
pm2 save

# Make PM2 start automatically on reboot
pm2 startup systemd
# Follow the instructions PM2 gives (copy and paste the sudo command)
```

#### Step 4: Nginx reverse proxy (optional, for HTTPS)

If you have a domain name and want to use HTTPS:

```bash
# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/quotastic
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/quotastic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Request SSL certificate
sudo certbot --nginx -d your-domain.com
```

#### Step 5: Firewall configuration

```bash
# UFW firewall setup
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### Management commands

```bash
# Check status
pm2 status

# View logs
pm2 logs quotastic

# Restart
pm2 restart quotastic

# Stop
pm2 stop quotastic

# Install updates
cd /home/quotastic/app
git pull
npm install
pm2 restart quotastic
```

#### Monitoring and logs

```bash
# Real-time logs
pm2 logs quotastic --lines 100

# CPU/Memory usage
pm2 monit

# View error logs
tail -f /home/quotastic/app/error.log

# System logs
sudo journalctl -u pm2-quotastic -n 50 -f
```

#### Backup strategy

```bash
# Create backup script
nano /home/quotastic/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/quotastic/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp /home/quotastic/app/database/quotes.db "$BACKUP_DIR/quotes_$DATE.db"

# Keep only last 7 days
find $BACKUP_DIR -name "quotes_*.db" -mtime +7 -delete
```

```bash
# Make executable and add to crontab
chmod +x /home/quotastic/backup.sh
crontab -e
# Add: 0 2 * * * /home/quotastic/backup.sh
```

#### Alternative: Systemd service (without PM2)

If you prefer to use systemd instead of PM2:

```bash
# Create service file
sudo nano /etc/systemd/system/quotastic.service
```

```ini
[Unit]
Description=Quotastic Slack Bot
After=network.target

[Service]
Type=simple
User=quotastic
WorkingDirectory=/home/quotastic/app
ExecStart=/usr/bin/node /home/quotastic/app/index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=quotastic
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl enable quotastic
sudo systemctl start quotastic
sudo systemctl status quotastic
```

## Database

The app uses SQLite for local storage. The database is automatically created in `database/quotes.db`.

For production, you might consider switching to:
- PostgreSQL (Heroku, Railway)
- MySQL (PlanetScale)
- MongoDB (MongoDB Atlas)

## Important Notes

- **Tokens**: You need exactly 3 tokens from Slack (see Step 3)
- **Socket Mode**: This bot uses Socket Mode, so no public URL is needed
- **Environment Variables**:
  - `NODE_ENV` and `PORT` are optional and not needed for Glitch
  - Only the Slack tokens are required

## Troubleshooting

### Bot not responding
- Check if all tokens are filled in correctly (no extra spaces)
- Verify the app is installed in your workspace
- Look at the logs for errors: `npm start`
- Make sure Socket Mode is enabled in your Slack app settings

### Database errors
- Delete `database/quotes.db` and restart the app
- Check if you have write permissions in the database directory

### Slash command not visible
- Reinstall the app in your workspace
- Wait a few minutes for Slack to sync the commands
- Make sure you used the manifest.json to create the app

### Token errors
- **"Invalid auth"**: Check your SLACK_BOT_TOKEN
- **"Signature verification failed"**: Check your SLACK_SIGNING_SECRET
- **"Cannot connect to Slack"**: Check your SLACK_APP_TOKEN

## Extensions

Ideas for additional features:
- Search quotes by keyword
- Quote statistics per user
- Export functionality
- Scheduled random quotes
- Reactions to quotes
- Quote categories/tags

## Support

For questions or issues, create an issue on GitHub!

---

Made with ❤️ by Build To Sell B.V.