import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';
import { ConversationRecord, RecordStatus } from '../../models/Record';
import { db } from '../../utils/database';
import { generateSummary } from '../../AI/summary';
import { getLoblawsProducts, Item } from '../../AI/items';

const endRecordCommand: IBotCommand = {
  name: 'endRecord',
  description: 'Ends recording a conversation and generates a summary with shopping items',
  aliases: ['end-record', 'stop-record', 'stop', 'summary'],
  category: CommandCategory.NONAME,
  
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    const chat = await message.getChat();
    
    // Only work in groups
    if (!chat.isGroup) {
      await message.reply('❌ This command only works in groups!');
      return;
    }

    try {
      const chatId = chat.id._serialized;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      // First, check if there's an existing pending record
      let record = await ConversationRecord.findOne({
        chatId,
        status: RecordStatus.PENDING
      });

      if (record) {
        // Update existing record with end information
        record.endMessageId = message.id._serialized;
        record.endTimestamp = currentTimestamp;
      } else {
        // No existing record, create a new one
        // Get the last 100 messages to determine start point
        const recentMessages = await db.getRecentMessages(chatId, 100);
        
        let startTimestamp = currentTimestamp;
        let startMessageId = message.id._serialized;
        
        if (recentMessages.length > 0) {
          // Use the oldest message from our recent messages as the start
          const oldestMessage = recentMessages[recentMessages.length - 1];
          startTimestamp = oldestMessage.timestamp;
          startMessageId = oldestMessage.messageId;
        }

        record = new ConversationRecord({
          chatId,
          chatName: chat.name,
          startMessageId,
          endMessageId: message.id._serialized,
          startTimestamp,
          endTimestamp: currentTimestamp,
          items: [],
          status: RecordStatus.PENDING
        });
      }

      // Get conversation text from the time range
      const conversationText = await db.getRecentNonBotMessagesByChatIdAndTimestamp(
        chatId,
        record.startTimestamp!,
        record.endTimestamp!
      );

      if (!conversationText || conversationText.trim().length === 0) {
        await message.reply('❌ No conversation found in the specified time range.');
        return;
      }

      // Generate summary and items
      const summaryResponse = await generateSummary(conversationText);
      
      // Update record with summary and items
      record.summary = summaryResponse.info;
      record.items = summaryResponse.items;
      record.status = RecordStatus.COMPLETED;
      
      // Save the record
      await record.save();

      // Get Loblaws products for each item
      const itemsWithProducts: { item: string; products: Item[] }[] = [];
      
      for (const item of summaryResponse.items) {
        try {
          const products = await getLoblawsProducts(item);
          itemsWithProducts.push({ item, products });
        } catch (error) {
          console.warn(`Could not fetch products for item: ${item}`, error);
          itemsWithProducts.push({ item, products: [] });
        }
      }

      // Format the response message
      let responseMessage = `✅ *Recording completed!*\n\n`;
      responseMessage += `**Summary:** ${summaryResponse.info}\n\n`;
      responseMessage += `**Items we will need:**\n`;

      for (const { item, products } of itemsWithProducts) {
        responseMessage += `• *${item}*\n`;
        
        if (products.length > 0) {
          for (const product of products) {
            const priceText = product.productPrice ? ` - $${product.productPrice.toFixed(2)}` : '';
            const urlText = product.productURL ? ` - ${product.productURL}` : '';
            responseMessage += `  - ${product.productName}${priceText}${urlText}\n`;
          }
        } 
        responseMessage += '\n';
      }

      await message.reply(responseMessage);
      
    } catch (error) {
      console.error('❌ Error ending recording:', error);
      await message.reply('❌ An error occurred while ending the recording. Please try again.');
    }
  }
};

export default endRecordCommand;
