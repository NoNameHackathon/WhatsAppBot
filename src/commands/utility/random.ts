import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';
import { db } from '../../utils/database';

const randomCommand: IBotCommand = {
  name: 'random',
  description: 'Randomly selects and resends one of the last 10 messages in the group',
  aliases: ['rand', 'randomsg'],
  category: CommandCategory.UTILITY,
  
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    const chat = await message.getChat();
    
    // Only work in groups
    if (!chat.isGroup) {
      await message.reply('❌ This command only works in groups!');
      return;
    }

    // Check if database is connected
    if (!db.connected) {
      await message.reply('❌ Database is not connected. Cannot retrieve message history.');
      return;
    }

    try {
      // Get the last 10 messages from this group
      const recentMessages = await db.getRecentMessages(chat.id._serialized, 10);
      
      if (recentMessages.length === 0) {
        await message.reply('❌ No recent messages found in this group!');
        return;
      }

      // Randomly select one message
      const randomIndex = Math.floor(Math.random() * recentMessages.length);
      const selectedMessage = recentMessages[randomIndex];
      
      // Format the timestamp for better readability
      const messageDate = new Date(selectedMessage.timestamp * 1000);
      const timeAgo = getTimeAgo(messageDate);
      
      // Get author information
      const authorInfo = selectedMessage.author || selectedMessage.from;
      const displayName = authorInfo.split('@')[0]; // Get the username part before @
      
      // Create the response message
      const responseText = `🎲 *Random Message from ${timeAgo}:*\n\n` +
                          `👤 *${displayName}:* ${selectedMessage.body}`;
      
      await message.reply(responseText);
      
    } catch (error) {
      console.error('❌ Error executing random command:', error);
      await message.reply('❌ An error occurred while fetching a random message.');
    }
  }
};

/**
 * Helper function to calculate time ago
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

export default randomCommand; 