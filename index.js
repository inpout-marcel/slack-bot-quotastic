require('dotenv').config();
const { App } = require('@slack/bolt');
const express = require('express');
const logger = require('./utils/logger');
const db = require('./database/db');
const quoteController = require('./controllers/quoteController');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command('/quote', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const args = command.text.trim().split(' ');
    const action = args[0].toLowerCase();
    
    logger.info(`Command received: /quote ${command.text}`, {
      user: command.user_name,
      channel: command.channel_name,
      action: action
    });
    
    // If no action specified, show a random quote
    if (!command.text.trim()) {
      await quoteController.getRandomQuote(respond);
      return;
    }
    
    switch (action) {
      case 'add':
        const quoteText = args.slice(1).join(' ');
        if (!quoteText) {
          await respond('Usage: `/quote add [text]`');
          return;
        }
        await quoteController.storeQuote(command, quoteText, respond);
        break;
        
      case 'random':
        await quoteController.getRandomQuote(respond);
        break;
        
      case 'list':
        await quoteController.listQuotes(respond);
        break;
        
      case 'delete':
        const deleteId = args[1];
        if (!deleteId || isNaN(deleteId)) {
          await respond('Usage: `/quote delete [ID]` - Find the ID with `/quote list`');
          return;
        }
        await quoteController.deleteQuote(command, parseInt(deleteId), respond);
        break;
        
      default:
        await respond({
          text: `*Quotastic (by Build To Sell B.V.)*\n\n` +
                `Available commands:\n` +
                `• \`/quote\` - Show a random quote\n` +
                `• \`/quote add [text]\` - Save a new quote\n` +
                `• \`/quote random\` - Show a random quote\n` +
                `• \`/quote list\` - View the last 5 quotes\n` +
                `• \`/quote delete [ID]\` - Delete a quote (only for the person who added it or the person quoted)`
        });
    }
  } catch (error) {
    logger.error('Error handling command:', error);
    await respond('Something went wrong while processing your command.');
  }
});

(async () => {
  try {
    await db.initialize();
    await app.start();
    logger.info('⚡️ Quotastic is running!');
  } catch (error) {
    logger.error('Failed to start app:', error);
    process.exit(1);
  }
})();