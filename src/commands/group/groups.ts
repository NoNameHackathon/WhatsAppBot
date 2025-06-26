import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';

const groupsCommand: IBotCommand = {
  name: 'groups',
  description: 'List all groups the bot is currently in',
  aliases: ['grouplist', 'gl'],
  category: CommandCategory.GROUP,
  
  async execute(message: Message, _args: string[], client: Client): Promise<void> {
    try {
      const chats = await client.getChats();
      const groups = chats.filter(chat => chat.isGroup);
      
      if (groups.length === 0) {
        await message.reply('📋 I\'m not in any groups currently.');
        return;
      }

      let groupList = `📋 *Groups I'm in (${groups.length}):*\n\n`;
      
      groups.forEach((group, index) => {
        const groupChat = group as any; // Type assertion for participants
        const participants = groupChat.participants ? groupChat.participants.length : 'Unknown';
        groupList += `${index + 1}. *${group.name}*\n`;
        groupList += `   👥 ${participants} members\n`;
        groupList += `   🆔 \`${group.id._serialized}\`\n\n`;
      });

      // Split message if too long
      if (groupList.length > 4000) {
        groupList = groupList.substring(0, 3900) + '\n\n... and more groups';
      }

      await message.reply(groupList);
    } catch (error) {
      console.error('Error fetching groups:', error);
      await message.reply('❌ Error fetching group list. Please try again later.');
    }
  }
};

export default groupsCommand; 