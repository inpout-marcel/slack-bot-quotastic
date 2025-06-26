# Quotastic (by Build To Sell B.V.)

A fun Slack bot to save your team's best quotes! 💬 Free hosting on Replit!

[![Run on Replit](https://replit.com/badge/github/your-repo/quotastic)](https://replit.com/new/github/your-repo/quotastic)

## Features

### Commands
- **`/quote`** - Show a random quote (default action)
- **`/quote add [text]`** - Save a new quote
- **`/quote random`** - Show a random quote  
- **`/quote list`** - View the last 5 quotes with their IDs
- **`/quote delete [ID]`** - Delete a quote (only allowed for the person who added it or the person quoted)

### How it works
- Quotes are stored with the author's name, who saved it, timestamp, and channel
- Delete permissions ensure quotes can only be removed by relevant people
- All commands work via slash commands - no need to @mention the bot
- Works in channels, private channels, and direct messages

## Quick Start on Replit

### Requirements
- A Slack workspace where you can install apps
- A free [Replit](https://replit.com) account

### Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From an app manifest"
4. Select your workspace
5. Paste the contents of `manifest.json`
6. Click "Create"

**Note**: The manifest uses Socket Mode, so you don't need any public URLs. Everything runs through a secure websocket connection.

### Step 2: Configure the app

#### Enable Socket Mode (IMPORTANT!)
1. Go to "Socket Mode" in the sidebar
2. Toggle "Enable Socket Mode" to ON
3. You'll be prompted to create an app token if you haven't already

#### Get your tokens:

1. **Signing Secret**
   - Go to "Basic Information"
   - Find "Signing Secret" under App Credentials
   - Click "Show" and copy the secret

2. **Bot Token**
   - Go to "OAuth & Permissions" in the sidebar
   - Click "Install to Workspace" button
   - Authorize the app (you'll see the permissions it needs)
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)

3. **App Token** (for Socket Mode)
   - Go to "Basic Information" > "App-Level Tokens"
   - Click "Generate Token and Scopes"
   - Give the token a name (e.g. "socket-mode")
   - Add the scope `connections:write`
   - Click "Generate"
   - Copy the token (starts with `xapp-`)

#### Required Permissions

The bot needs these OAuth scopes (automatically set by manifest.json):
- `channels:history` - Read messages in public channels
- `channels:read` - View basic channel info
- `chat:write` - Post messages
- `commands` - Use slash commands
- `groups:history` - Read messages in private channels
- `groups:read` - View basic private channel info
- `im:history` - Read direct messages
- `im:read` - View basic DM info
- `users:read` - View basic user info

### Step 3: Deploy to Replit

1. **Import the project**
   - Go to [replit.com](https://replit.com)
   - Click "+ Create Repl"
   - Choose "Import from GitHub"
   - Paste this repository URL: `https://github.com/your-username/quotastic`
   - Or use this button: [![Run on Replit](https://replit.com/badge/github/your-username/quotastic)](https://replit.com/new/github/your-username/quotastic)

2. **Add your Slack tokens**
   - In Replit, click on "Secrets" (lock icon) in the left sidebar
   - Add these secrets one by one:
     - Key: `SLACK_BOT_TOKEN`, Value: `xoxb-your-bot-token`
     - Key: `SLACK_SIGNING_SECRET`, Value: `your-signing-secret`
     - Key: `SLACK_APP_TOKEN`, Value: `xapp-your-app-token`
   - Secrets are encrypted and secure

3. **Start the bot**
   - Click the big green "Run" button
   - Watch the console for "⚡️ Quotastic is running!"
   - Your bot should connect to Slack immediately

### Step 4: Add the bot to your workspace

1. **Add to channels** (optional - slash commands work everywhere):
   - Type `@Quotastic` in any channel
   - Click "Add to Channel" when prompted
   - Or: Channel settings → Integrations → Add App → Select Quotastic

2. **Using the bot**:
   - Slash commands work in any channel or DM
   - You don't need to invite the bot first
   - Commands are available workspace-wide immediately

### Step 5: Test your bot

1. **First test** - Type `/quote` anywhere to see the help menu

2. **Add a quote**:
   ```
   /quote add Just shipped an awesome feature!
   ```
   The bot will confirm the quote was saved and show who said it with its ID

3. **View recent quotes**:
   ```
   /quote list
   ```
   Shows the last 5 quotes with their IDs (only visible to you)

4. **Get a random quote**:
   ```
   /quote random
   ```
   Posts a random quote for everyone to see

5. **Delete a quote**:
   ```
   /quote delete 1
   ```
   Only works if you added the quote or you're the person quoted

### Usage Examples

- **During standup**: `/quote add I broke production but fixed it in 5 minutes`
- **Team wins**: `/quote add We just hit 1000 users!`  
- **Funny moments**: `/quote add Is it DNS? It's always DNS`
- **Weekly recap**: `/quote` to share a random fun moment
- **Share specific quote**: Check ID with `/quote list`, then share it

## Why Replit?

- **Free hosting** - Generous free tier
- **Always on** - Repls stay active longer than Glitch
- **Built-in database** - SQLite works perfectly
- **Easy secrets management** - Secure environment variables
- **Multiplayer editing** - Collaborate with your team
- **No credit card required** - Start coding immediately

## Replit-Specific Features

### Automatic Features
- **Auto-install**: Dependencies install automatically
- **Auto-restart**: Crashes are handled gracefully
- **Node.js 18**: Modern JavaScript support built-in

### Viewing Logs
- The console shows all logs in real-time
- Errors appear in red for easy debugging
- Search logs with Ctrl/Cmd+F

### Using the Shell
1. Click "Shell" tab in the console area
2. Run commands like:
   - `ls database/` - Check database files
   - `cat error.log` - View error logs
   - `npm list` - Check installed packages

### Keeping Your Bot Active
Replit free tier limitations:
- Repls sleep after ~30 minutes of HTTP inactivity
- Socket Mode helps - bot stays connected longer
- For 24/7 uptime, consider Replit's Hacker plan ($7/month)

## Database on Replit

The app uses SQLite which works perfectly on Replit:
- Database is stored in `database/quotes.db`
- Persists across restarts
- Stored in Replit's persistent filesystem
- Automatically created on first run

### Backing Up Your Quotes

1. Click "Shell" tab in the console
2. Run: `cp database/quotes.db database/backup_$(date +%Y%m%d).db`
3. Download files:
   - Click the three dots menu on any file
   - Select "Download"
   - Or use: `zip -r backup.zip database/`

## Important Notes for Replit

- **Secrets are secure**: Use Secrets tab, never commit tokens
- **Public by default**: Make private with Hacker plan
- **Socket Mode**: No webhook URL needed - perfect for Replit
- **Free tier limits**: Great for teams under 50 people
- **Forking**: Others can fork your repl but won't see secrets

## Troubleshooting on Replit

### Bot not responding
1. Check the console for errors
2. Verify all 3 tokens in Secrets (lock icon)
3. Click "Stop" then "Run" to restart
4. Make sure the app is installed in your Slack workspace

### Database errors
1. Open Shell tab
2. Run: `rm -f database/quotes.db`
3. Click "Stop" then "Run" to restart

### Slash command not visible
1. Reinstall the app in your Slack workspace
2. Wait 3-5 minutes for Slack to sync
3. Try refreshing Slack (Cmd/Ctrl + R)

### Common Replit issues
- **"Cannot find module" errors**:
  - Click "Shell" tab
  - Run: `npm install`
  - Click "Run" again
- **Bot stops after 30 minutes**:
  - Normal for free tier
  - Upgrade to Hacker plan for always-on
  - Or use UptimeRobot to ping every 20 mins
- **"Permission denied" errors**:
  - Run: `chmod +x index.js`
- **Out of storage space**:
  - Run: `rm -f *.log error.log combined.log`
  - Clear old database backups

### Token errors
- **"Invalid auth"**: Your SLACK_BOT_TOKEN is wrong
- **"Signature verification failed"**: Your SLACK_SIGNING_SECRET is wrong  
- **"Cannot connect to Slack"**: Your SLACK_APP_TOKEN is wrong

### Slash command not working

#### If you see "dispatch_failed" error:
This means Slack can't connect to your bot. Check these in order:

1. **Is your Replit app running?**
   - Look at the console output
   - Should see "⚡️ Quotastic is running!"
   - If stopped, click "Run" button
   - If errors, fix those first

2. **Are all 3 tokens in Secrets?**
   - Click "Secrets" (lock icon) in sidebar
   - Verify all three secrets exist:
     - `SLACK_BOT_TOKEN` (starts with xoxb-)
     - `SLACK_SIGNING_SECRET`
     - `SLACK_APP_TOKEN` (starts with xapp-)
   - No quotes in the values!

3. **Is Socket Mode enabled?**
   - Go to [api.slack.com/apps](https://api.slack.com/apps) 
   - Select your app
   - Click "Socket Mode" in sidebar
   - Must be toggled ON
   - If it was OFF, turn it ON and wait 30 seconds

4. **Check App Token has correct scope**:
   - Go to "Basic Information" > "App-Level Tokens"
   - Click on your token name
   - Must have `connections:write` scope
   - If not, regenerate with correct scope

5. **Reinstall the app**:
   - Go to "OAuth & Permissions"
   - Click "Reinstall to Workspace"
   - This refreshes all connections

#### If `/quote` doesn't appear when typing:

1. **Check Slash Commands**:
   - Go to "Slash Commands" in sidebar
   - Verify `/quote` is listed there
   - If not, the manifest didn't apply correctly

2. **Wait and refresh**:
   - Slash commands can take 3-5 minutes to propagate
   - Try refreshing Slack (Cmd/Ctrl + R)
   - Try in a different channel or DM

## Updating Your Bot on Replit

### Method 1: Direct editing
1. Make changes directly in Replit editor
2. Click "Run" to restart with changes

### Method 2: Git sync
1. Connect your Repl to GitHub
2. Use version control tab to pull updates
3. Or in Shell: `git pull origin main`

### Method 3: Re-import
1. Create a new Repl from updated GitHub repo
2. Copy your Secrets to the new Repl

## Managing Your Replit Project

### Keep it private
- Free Repls are public by default
- Secrets are always private
- For private code: Upgrade to Hacker plan

### Share with team
1. Click "Invite" button
2. Share via link or username
3. Collaborators can edit but not see Secrets

## Extensions

Ideas for additional features:
- Search quotes by keyword
- Quote statistics per user  
- Export functionality
- Scheduled random quotes
- Reactions to quotes
- Quote categories/tags

## Local Development

Want to develop locally before pushing to Replit?

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

# Push to GitHub when ready
git push origin main
# Then pull in Replit or re-import
```

## Alternative Deployment Options

If Replit changes their free tier, here are other free options:

### Option 1: Render.com
- Free tier includes 750 hours/month
- Automatic deploys from GitHub
- Environment variables support

### Option 2: Fly.io
- Free tier with 3 shared VMs
- Great for always-on apps
- Requires credit card (but won't charge)

### Option 3: Local + ngrok
- Run on your computer
- Use ngrok for public URL (if needed)
- 100% free but requires your machine

### Option 4: Oracle Cloud Free Tier
- Always free VM (24/7)
- More complex setup
- Best for long-term hosting

## Support

- **Replit Help**: [ask.replit.com](https://ask.replit.com)
- **Project Issues**: Create an issue on GitHub
- **Slack API Help**: [api.slack.com/support](https://api.slack.com/support)

---

Made with ❤️ by Build To Sell B.V.