import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';

const timeCommand: IBotCommand = {
  name: 'time',
  description: 'Show current date and time',
  aliases: ['date', 'now'],
  category: CommandCategory.UTILITY,
  
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    const now = new Date();
    
    const timeText = `🕒 *Current Time*

*Date:* ${now.toDateString()}
*Time:* ${now.toLocaleTimeString()}
*Timezone:* ${Intl.DateTimeFormat().resolvedOptions().timeZone}
*UTC:* ${now.toUTCString()}
*Timestamp:* ${now.getTime()}`;

    await message.reply(timeText);
  }
};

export default timeCommand; 