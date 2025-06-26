import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';

const pingCommand: IBotCommand = {
  name: 'ping',
  description: 'Test if the bot is working and show response time',
  aliases: ['pong'],
  category: CommandCategory.GENERAL,
  
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    const startTime = Date.now();
    
    const replyMessage = await message.reply('🏓 Pong!');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Edit the reply to include response time
    setTimeout(async () => {
      try {
        await replyMessage.reply(`🏓 Pong! Response time: ${responseTime}ms`);
      } catch (error) {
        console.error('Error updating ping message:', error);
      }
    }, 100);
  }
};

export default pingCommand; 