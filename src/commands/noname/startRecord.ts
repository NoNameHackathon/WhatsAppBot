import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';
import { ConversationRecord, RecordStatus } from '../../models/Record';

const startRecordCommand: IBotCommand = {
  name: 'startRecord',
  description: 'Starts recording a conversation for summary generation',
  aliases: ['start-record', 'record', 'start'],
  category: CommandCategory.NONAME,
  
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    const chat = await message.getChat();
    
    // Only work in groups
    if (!chat.isGroup) {
      await message.reply('❌ This command only works in groups!');
      return;
    }

    try {
      // Check if there's already an active recording for this chat
      const existingRecord = await ConversationRecord.findOne({
        chatId: chat.id._serialized,
        status: RecordStatus.PENDING
      });

      if (existingRecord) {
        await message.reply('❌ There is already an active recording in this group! Please end the current recording before starting a new one.');
        return;
      }

      // Create a new conversation record
      const newRecord = new ConversationRecord({
        chatId: chat.id._serialized,
        chatName: chat.name,
        startMessageId: message.id._serialized,
        startTimestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        items: [],
        status: RecordStatus.PENDING
      });

      // Save the record to database
      await newRecord.save();

      await message.reply('✅ *Recording started!*\n\n📝 Conversation recording has begun. Use the stop recording command when you want to generate a summary.');
      
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      await message.reply('❌ An error occurred while starting the recording. Please try again.');
    }
  }
};

export default startRecordCommand; 