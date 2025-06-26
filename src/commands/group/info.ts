import { Message, Client, GroupChat } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';

const infoCommand: IBotCommand = {
  name: 'info',
  description: 'Show information about the current group',
  aliases: ['groupinfo', 'gi'],
  category: CommandCategory.GROUP,
  
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    const chat = await message.getChat();
    
    if (!chat.isGroup) {
      await message.reply('❌ This command can only be used in groups!');
      return;
    }

    const groupChat = chat as GroupChat;
    const participants = groupChat.participants.length;
    const admins = groupChat.participants.filter(p => p.isAdmin).length;
    
    const infoText = `📊 *Group Information*

*Name:* ${groupChat.name}
*Description:* ${groupChat.description || 'No description'}
*Participants:* ${participants}
*Admins:* ${admins}
*Group ID:* \`${groupChat.id._serialized}\`
*Created:* ${groupChat.createdAt ? new Date(Number(groupChat.createdAt) * 1000).toLocaleDateString() : 'Unknown'}
*Owner:* ${groupChat.owner || 'Unknown'}`;

    await message.reply(infoText);
  }
};

export default infoCommand; 