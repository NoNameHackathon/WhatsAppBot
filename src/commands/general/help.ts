import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';

const helpCommand: IBotCommand = {
  name: 'help',
  description: 'Show all available commands or get help for a specific command',
  aliases: ['h', 'commands'],
  category: CommandCategory.GENERAL,
  
  async execute(message: Message, args: string[], _client: Client): Promise<void> {
    
    if (args.length === 0) {
      // Show all commands
      const helpText = `🤖 *Bot Commands*

*General Commands:*
• !help - Show this help message
• !ping - Test if bot is working
• !stats - Show your message statistics

*Group Commands:*
• !info - Show group information
• !groups - List all groups I'm in

*Utility Commands:*
• !time - Show current time
• !weather [city] - Get weather information
• !random - Randomly select and resend one of the last 10 messages

*Usage:* Use \`!help [command]\` for detailed help on a specific command.

🔧 *Tip:* Commands are case-insensitive and you can use aliases!`;

      await message.reply(helpText);
    } else {
      // Show help for specific command
      const commandName = args[0].toLowerCase();
      // Note: In a real implementation, you'd access the command handler to get command details
      await message.reply(`ℹ️ Help for command: *${commandName}*\n\nUse \`!help\` to see all available commands.`);
    }
  }
};

export default helpCommand; 