# Quotastic (by Build To Sell B.V.)

A fun Slack bot to save your team's best quotes! 💬 Designed to run on Glitch.

## Features

- **`/quote store [text]`** - Save a new quote
- **`/quote random`** - Get a random quote
- **`/quote list`** - View the last 5 quotes
- **`/quote delete [ID]`** - Delete a quote (only for the person who added it or the person quoted)

## Quick Start on Glitch

### Requirements
- A Slack workspace where you can install apps
- A free [Glitch](https://glitch.com) account

### Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From an app manifest"
4. Select your workspace
5. Paste the contents of `manifest.json`
6. Click "Create"

### Step 2: Configure the app

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

### Step 3: Deploy to Glitch

1. **Import the project**
   - Go to [glitch.com](https://glitch.com)
   - Click "New Project" > "Import from GitHub"
   - Use this repository URL: `https://github.com/your-username/quotastic`
   - Or click: [Remix on Glitch](https://glitch.com/edit/#!/import/github/your-username/quotastic)

2. **Add your Slack tokens**
   - In the Glitch editor, click on `.env` in the file list
   - Add your three tokens:
     ```
     SLACK_BOT_TOKEN=xoxb-your-bot-token
     SLACK_SIGNING_SECRET=your-signing-secret
     SLACK_APP_TOKEN=xapp-your-app-token
     ```
   - Glitch automatically keeps `.env` private and secure

3. **That's it!**
   - Glitch automatically installs dependencies and starts your bot
   - Check the logs by clicking "Tools" > "Logs" at the bottom
   - Your bot should connect to Slack within seconds

### Step 4: Test your bot

1. Go to any Slack channel
2. Type `/quote` to see the help menu
3. Try `/quote store This is my first quote!`
4. Use `/quote list` to see your quotes

## Why Glitch?

- **Free hosting** - No credit card required
- **Always on** - Glitch keeps your bot running 24/7
- **Automatic HTTPS** - Secure by default
- **Easy updates** - Edit code directly in the browser
- **Private .env** - Tokens are kept secure automatically
- **No terminal needed** - Everything works in your browser

## Glitch-Specific Features

### Automatic Restarts
Glitch automatically restarts your app when:
- You edit any file
- The app crashes
- Dependencies are updated

### Viewing Logs
1. Click "Tools" at the bottom of the Glitch editor
2. Select "Logs"
3. Watch real-time logs of your bot

### Debugging
1. Click "Tools" > "Terminal"
2. Run commands like:
   - `ls database/` - Check if database exists
   - `cat error.log` - View error logs
   - `node --version` - Check Node version

### Keeping Your Bot Awake
Glitch apps sleep after 5 minutes of inactivity. For a Slack bot using Socket Mode, this isn't a problem because:
- Socket Mode maintains a persistent connection
- The bot wakes instantly when commands are used
- No external pinging service needed

## Database on Glitch

The app uses SQLite which works perfectly on Glitch:
- Database is stored in `database/quotes.db`
- Persists across restarts
- No configuration needed
- Automatically created on first run

### Backing Up Your Quotes

1. In Glitch, click "Tools" > "Terminal"
2. Run: `cp database/quotes.db database/backup_$(date +%Y%m%d).db`
3. Download via: "Tools" > "Import and Export" > "Download Project"

## Important Notes for Glitch

- **Private by default**: Your `.env` file is never visible to others
- **Automatic HTTPS**: All Glitch apps use HTTPS
- **Socket Mode**: No webhook URL needed - the bot connects to Slack
- **Free limits**: Glitch free tier is perfect for team Slack bots
- **Remixing**: Others can "remix" your public project but won't see your tokens

## Troubleshooting on Glitch

### Bot not responding
1. Check logs: "Tools" > "Logs"
2. Verify all 3 tokens in `.env` (no quotes or extra spaces)
3. Click "Tools" > "Terminal" and run: `refresh`
4. Make sure the app is installed in your Slack workspace

### Database errors
1. Open Terminal: "Tools" > "Terminal"
2. Run: `rm -f database/quotes.db`
3. The app will auto-restart and create a new database

### Slash command not visible
1. Reinstall the app in your Slack workspace
2. Wait 3-5 minutes for Slack to sync
3. Try refreshing Slack (Cmd/Ctrl + R)

### Common Glitch issues
- **"Error: Cannot find module"**: Click "Tools" > "Terminal", run `enable-pnpm && pnpm install`
- **App sleeping**: This is normal - it wakes instantly when you use a command
- **Disk space**: Run `rm -f *.log` in Terminal to free space

### Token errors
- **"Invalid auth"**: Your SLACK_BOT_TOKEN is wrong
- **"Signature verification failed"**: Your SLACK_SIGNING_SECRET is wrong  
- **"Cannot connect to Slack"**: Your SLACK_APP_TOKEN is wrong

## Updating Your Bot on Glitch

### Method 1: Direct editing
1. Make changes directly in the Glitch editor
2. The bot auto-restarts with your changes

### Method 2: Import from GitHub
1. Push updates to your GitHub repo
2. In Glitch: "Tools" > "Import and Export" > "Import from GitHub"
3. Enter your repo URL

### Method 3: Terminal
1. "Tools" > "Terminal"
2. Run: `git pull origin main`

## Making Your Glitch Project

### Keep it private
- By default, others can see your code (but not `.env`)
- To make fully private: Settings > "Make This Project Private" (requires Glitch subscription)

### Share with team
1. Click "Share" button
2. Invite teammates via email
3. They can edit but can't see `.env` values

## Extensions

Ideas for additional features:
- Search quotes by keyword
- Quote statistics per user  
- Export functionality
- Scheduled random quotes
- Reactions to quotes
- Quote categories/tags

## Local Development

Want to develop locally before pushing to Glitch?

```bash
# Clone the repo
git clone <repository-url>
cd quotastic

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your tokens to .env

# Run locally
npm run dev

# Push to Glitch when ready
git push origin main
```

## Support

- **Glitch Help**: [support.glitch.com](https://support.glitch.com)
- **Project Issues**: Create an issue on GitHub
- **Slack API Help**: [api.slack.com/support](https://api.slack.com/support)

---

Made with ❤️ by Build To Sell B.V.