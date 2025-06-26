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
        text: `✅ Quote saved!`,
        attachments: [{
          color: 'good',
          fields: [
            {
              title: 'Quote',
              value: `"${quoteText}"`,
              short: false
            },
            {
              title: 'ID',
              value: `#${quoteId}`,
              short: true
            },
            {
              title: 'By',
              value: command.user_name,
              short: true
            },
            {
              title: 'Channel',
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
      await respond('Something went wrong while saving the quote.');
    }
  }

  async getRandomQuote(respond) {
    try {
      const quote = await db.getRandomQuote();
      
      if (!quote) {
        await respond('No quotes saved yet. Use `/quote add [text]` to add the first one!');
        return;
      }
      
      const date = new Date(quote.timestamp);
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      await respond({
        response_type: 'in_channel',
        text: `🎲 Random quote:`,
        attachments: [{
          color: '#FF6B6B',
          fields: [
            {
              title: 'Quote',
              value: `"${quote.text}"`,
              short: false
            },
            {
              title: 'ID',
              value: `#${quote.id}`,
              short: true
            },
            {
              title: 'Said by',
              value: quote.author,
              short: true
            },
            {
              title: 'Date',
              value: formattedDate,
              short: true
            },
            {
              title: 'Channel',
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
      await respond('Something went wrong while fetching a quote.');
    }
  }

  async listQuotes(respond) {
    try {
      const quotes = await db.getLatestQuotes(5);
      const totalCount = await db.getQuoteCount();
      
      if (quotes.length === 0) {
        await respond('No quotes saved yet. Use `/quote add [text]` to add the first one!');
        return;
      }
      
      const attachments = quotes.map((quote, index) => {
        const date = new Date(quote.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return {
          color: index === 0 ? '#4A90E2' : '#E8E8E8',
          fields: [
            {
              title: `${index + 1}. "${quote.text}" (ID: #${quote.id})`,
              value: `_${quote.author} in #${quote.channel} - ${formattedDate}_`,
              short: false
            }
          ]
        };
      });
      
      await respond({
        response_type: 'ephemeral',
        text: `📚 Latest ${quotes.length} quotes (of ${totalCount} total):`,
        attachments: [
          ...attachments,
          {
            color: '#36a64f',
            text: `_Use \`/quote\` or \`/quote random\` for a random quote_\n_Use \`/quote delete [ID]\` to delete a quote_`,
            footer: 'Quotastic (by Build To Sell B.V.)',
            footer_icon: '📝',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      });
    } catch (error) {
      logger.error('Error listing quotes:', error);
      await respond('Something went wrong while fetching quotes.');
    }
  }

  async deleteQuote(command, quoteId, respond) {
    try {
      const quote = await db.getQuoteById(quoteId);
      
      if (!quote) {
        await respond({
          response_type: 'ephemeral',
          text: `❌ Quote with ID #${quoteId} does not exist.`
        });
        return;
      }
      
      const canDelete = quote.stored_by_id === command.user_id || 
                       quote.author === command.user_name;
      
      if (!canDelete) {
        await respond({
          response_type: 'ephemeral',
          text: `❌ You don't have permission to delete this quote. Only the person who added it (${quote.stored_by}) or the person quoted (${quote.author}) can delete it.`
        });
        return;
      }
      
      const deleted = await db.deleteQuote(quoteId);
      
      if (deleted) {
        await respond({
          response_type: 'in_channel',
          text: `🗑️ Quote deleted`,
          attachments: [{
            color: 'warning',
            fields: [
              {
                title: 'Deleted quote',
                value: `"${quote.text}"`,
                short: false
              },
              {
                title: 'ID',
                value: `#${quoteId}`,
                short: true
              },
              {
                title: 'Deleted by',
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
          text: `❌ Something went wrong while deleting the quote.`
        });
      }
    } catch (error) {
      logger.error('Error deleting quote:', error);
      await respond('Something went wrong while deleting the quote.');
    }
  }
}

module.exports = new QuoteController();