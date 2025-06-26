import mongoose from 'mongoose';
import 'reflect-metadata';
import { Message as WWebMessage } from 'whatsapp-web.js';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { MessageDirection } from '../types';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseManager {
  private isConnected = false;

  /**
   * Connect to MongoDB database
   */
  public async connect(mongoUri?: string): Promise<void> {
    if (this.isConnected) {
      return;
    }

    const uri = mongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp-bot';

    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  /**
   * Save a WhatsApp message to the database
   */
  public async saveMessage(
    wwebMessage: WWebMessage, 
    direction: MessageDirection,
    chatName?: string
  ): Promise<void> {
    try {
      const chat = await wwebMessage.getChat();
      
      const messageData = {
        messageId: wwebMessage.id.id,
        body: wwebMessage.body,
        from: wwebMessage.from,
        to: wwebMessage.to,
        chatId: chat.id._serialized,
        chatName: chatName || chat.name,
        author: wwebMessage.author,
        timestamp: wwebMessage.timestamp,
        direction,
        isGroup: chat.isGroup,
        messageType: wwebMessage.type,
        hasMedia: wwebMessage.hasMedia,
        isForwarded: wwebMessage.isForwarded,
        quotedMessage: wwebMessage.hasQuotedMsg ? (wwebMessage as any).quotedMsgId : undefined,
        mentions: wwebMessage.mentionedIds,
        rawData: {
          deviceType: wwebMessage.deviceType,
          ack: wwebMessage.ack,
          broadcast: wwebMessage.broadcast
        } as Record<string, unknown>
      };

      // Add media data if present
      if (wwebMessage.hasMedia) {
        try {
          const media = await wwebMessage.downloadMedia();
          messageData.rawData = {
            ...messageData.rawData,
            mediaType: media.mimetype,
            mediaSize: media.data.length
          } as Record<string, unknown>;
        } catch (error) {
          console.warn('Could not download media for message:', error);
        }
      }

      // Add location data if present
      if (wwebMessage.location) {
        // @ts-expect-error - location property exists but not in types
        const location = wwebMessage.location as {
          latitude: number;
          longitude: number;
          description?: string;
        };
        messageData.rawData = {
          ...messageData.rawData,
          location
        } as Record<string, unknown>;
      }

      await Message.create(messageData);
      console.log(`💾 Saved message: ${wwebMessage.id.id}`);
    } catch (error) {
      console.error('❌ Error saving message to database:', error);
    }
  }

  /**
   * Update or create user statistics
   */
  public async updateUserStats(
    userId: string, 
    userData?: {
      username?: string;
      pushname?: string;
      profilePicUrl?: string;
      about?: string;
    }
  ): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { userId },
        {
          $inc: { messageCount: 1 },
          $set: {
            lastSeen: new Date(),
            ...(userData?.username && { username: userData.username }),
            ...(userData?.pushname && { pushname: userData.pushname }),
            ...(userData?.profilePicUrl && { profilePicUrl: userData.profilePicUrl }),
            ...(userData?.about && { about: userData.about })
          }
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('❌ Error updating user stats:', error);
    }
  }

  /**
   * Get message statistics for a user
   */
  public async getUserStats(userId: string): Promise<{
    messageCount: number;
    lastSeen: Date;
    joinedGroups: string[];
  } | null> {
    try {
      const user = await User.findOne({ userId });
      return user ? {
        messageCount: user.messageCount,
        lastSeen: user.lastSeen,
        joinedGroups: user.joinedGroups
      } : null;
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      return null;
    }
  }

  /**
   * Get message count for a specific chat
   */
  public async getChatMessageCount(chatId: string): Promise<number> {
    try {
      return await Message.countDocuments({ chatId });
    } catch (error) {
      console.error('❌ Error fetching chat message count:', error);
      return 0;
    }
  }

  /**
   * Get the last N messages from a specific chat
   */
  public async getRecentMessages(chatId: string, limit: number = 10): Promise<any[]> {
    try {
      return await Message.find({ 
        chatId,
        direction: MessageDirection.INCOMING, // Only get incoming messages (not bot messages)
        body: { $ne: '' } // Exclude empty messages
      })
      .sort({ timestamp: -1 }) // Sort by timestamp descending (newest first)
      .limit(limit)
      .lean(); // Return plain objects instead of Mongoose documents
    } catch (error) {
      console.error('❌ Error fetching recent messages:', error);
      return [];
    }
  }

  public async getRecentNonBotMessagesByChatIdAndTimestamp(chatId: string, startTimestamp: number, endTimestamp: number): Promise<string> {

    try {
      const messages = await Message.find({ 
        chatId,
        direction: MessageDirection.INCOMING,
        timestamp: { $gte: startTimestamp, $lte: endTimestamp }
      })
      .sort({ timestamp: 1 }) // Sort by timestamp ascending (oldest first)
      .lean();
      // get all the conversation text from the messages
      const conversationText = messages.map((message) => message.body).join(" ");
      return conversationText;
    } catch (error) {
      console.error('❌ Error fetching recent messages:', error);
      return "";
    }
  }

  /**
   * Check if database is connected
   */
  public get connected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Export singleton instance
export const db = new DatabaseManager(); 