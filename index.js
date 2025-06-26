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
    const action = args[0];
    
    logger.info(`Command received: /quote ${command.text}`, {
      user: command.user_name,
      channel: command.channel_name,
      action: action
    });
    
    switch (action) {
      case 'store':
        const quoteText = args.slice(1).join(' ');
        if (!quoteText) {
          await respond('Gebruik: `/quote store [tekst]`');
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
          await respond('Gebruik: `/quote delete [ID]` - Vind het ID met `/quote list`');
          return;
        }
        await quoteController.deleteQuote(command, parseInt(deleteId), respond);
        break;
        
      default:
        await respond({
          text: `*Quotastic (by Build To Sell B.V.)*\n\n` +
                `Beschikbare commando's:\n` +
                `• \`/quote store [tekst]\` - Sla een nieuwe quote op\n` +
                `• \`/quote random\` - Krijg een willekeurige quote\n` +
                `• \`/quote list\` - Bekijk de laatste 5 quotes\n` +
                `• \`/quote delete [ID]\` - Verwijder een quote (alleen voor toevoeger of persoon in quote)`
        });
    }
  } catch (error) {
    logger.error('Error handling command:', error);
    await respond('Er ging iets mis bij het verwerken van je commando.');
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