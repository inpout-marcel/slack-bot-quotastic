const db = require('../database/db');
const logger = require('../utils/logger');

class QuoteController {
  async storeQuote(command, quoteText, respond) {
    try {
      const quoteId = await db.addQuote(
        quoteText,
        command.user_name,
        command.user_name,
        command.user_id,
        command.channel_name
      );
      
      await respond({
        response_type: 'in_channel',
        text: `✅ Quote opgeslagen!`,
        attachments: [{
          color: 'good',
          fields: [
            {
              title: 'Quote',
              value: `"${quoteText}"`,
              short: false
            },
            {
              title: 'Door',
              value: command.user_name,
              short: true
            },
            {
              title: 'Kanaal',
              value: `#${command.channel_name}`,
              short: true
            }
          ],
          footer: 'Quotastic (by Build To Sell B.V.)',
          footer_icon: '📝',
          ts: Math.floor(Date.now() / 1000)
        }]
      });
      
      logger.info(`Quote stored: ID ${quoteId}`);
    } catch (error) {
      logger.error('Error storing quote:', error);
      await respond('Er ging iets mis bij het opslaan van de quote.');
    }
  }

  async getRandomQuote(respond) {
    try {
      const quote = await db.getRandomQuote();
      
      if (!quote) {
        await respond('Er zijn nog geen quotes opgeslagen. Gebruik `/quote store [tekst]` om de eerste toe te voegen!');
        return;
      }
      
      const date = new Date(quote.timestamp);
      const formattedDate = date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      await respond({
        response_type: 'in_channel',
        text: `🎲 Willekeurige quote:`,
        attachments: [{
          color: '#FF6B6B',
          fields: [
            {
              title: 'Quote',
              value: `"${quote.text}"`,
              short: false
            },
            {
              title: 'Gezegd door',
              value: quote.author,
              short: true
            },
            {
              title: 'Datum',
              value: formattedDate,
              short: true
            },
            {
              title: 'Kanaal',
              value: `#${quote.channel}`,
              short: true
            }
          ],
          footer: 'Quotastic (by Build To Sell B.V.)',
          footer_icon: '💬',
          ts: Math.floor(Date.now() / 1000)
        }]
      });
    } catch (error) {
      logger.error('Error getting random quote:', error);
      await respond('Er ging iets mis bij het ophalen van een quote.');
    }
  }

  async listQuotes(respond) {
    try {
      const quotes = await db.getLatestQuotes(5);
      const totalCount = await db.getQuoteCount();
      
      if (quotes.length === 0) {
        await respond('Er zijn nog geen quotes opgeslagen. Gebruik `/quote store [tekst]` om de eerste toe te voegen!');
        return;
      }
      
      const attachments = quotes.map((quote, index) => {
        const date = new Date(quote.timestamp);
        const formattedDate = date.toLocaleDateString('nl-NL', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return {
          color: index === 0 ? '#4A90E2' : '#E8E8E8',
          fields: [
            {
              title: `${index + 1}. "${quote.text}" (ID: ${quote.id})`,
              value: `_${quote.author} in #${quote.channel} - ${formattedDate}_`,
              short: false
            }
          ]
        };
      });
      
      await respond({
        response_type: 'ephemeral',
        text: `📚 Laatste ${quotes.length} quotes (van ${totalCount} totaal):`,
        attachments: [
          ...attachments,
          {
            color: '#36a64f',
            text: `_Gebruik \`/quote random\` voor een willekeurige quote_\n_Gebruik \`/quote delete [ID]\` om een quote te verwijderen_`,
            footer: 'Quotastic (by Build To Sell B.V.)',
            footer_icon: '📝',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      });
    } catch (error) {
      logger.error('Error listing quotes:', error);
      await respond('Er ging iets mis bij het ophalen van de quotes.');
    }
  }

  async deleteQuote(command, quoteId, respond) {
    try {
      const quote = await db.getQuoteById(quoteId);
      
      if (!quote) {
        await respond({
          response_type: 'ephemeral',
          text: `❌ Quote met ID ${quoteId} bestaat niet.`
        });
        return;
      }
      
      const canDelete = quote.stored_by_id === command.user_id || 
                       quote.author === command.user_name;
      
      if (!canDelete) {
        await respond({
          response_type: 'ephemeral',
          text: `❌ Je hebt geen rechten om deze quote te verwijderen. Alleen degene die de quote heeft toegevoegd (${quote.stored_by}) of degene die in de quote staat (${quote.author}) kan deze verwijderen.`
        });
        return;
      }
      
      const deleted = await db.deleteQuote(quoteId);
      
      if (deleted) {
        await respond({
          response_type: 'in_channel',
          text: `🗑️ Quote verwijderd`,
          attachments: [{
            color: 'warning',
            fields: [
              {
                title: 'Verwijderde quote',
                value: `"${quote.text}"`,
                short: false
              },
              {
                title: 'Door',
                value: command.user_name,
                short: true
              }
            ],
            footer: 'Quotastic (by Build To Sell B.V.)',
            footer_icon: '🗑️',
            ts: Math.floor(Date.now() / 1000)
          }]
        });
        
        logger.info(`Quote ${quoteId} deleted by ${command.user_name}`);
      } else {
        await respond({
          response_type: 'ephemeral',
          text: `❌ Er ging iets mis bij het verwijderen van de quote.`
        });
      }
    } catch (error) {
      logger.error('Error deleting quote:', error);
      await respond('Er ging iets mis bij het verwijderen van de quote.');
    }
  }
}

module.exports = new QuoteController();