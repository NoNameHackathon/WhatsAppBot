import 'reflect-metadata';
import { Client, LocalAuth, Message as WWebMessage, GroupChat } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { CommandHandler } from './utils/commandHandler';
import { db } from './utils/database';
import { IBotConfig, MessageDirection } from './types';
import { v4 as uuidv4 } from 'uuid';

export class WhatsAppBot {
  private client: Client;
  private commandHandler: CommandHandler;
  private config: IBotConfig;

  constructor(config: Partial<IBotConfig> = {}) {
    this.config = {
      prefix: '!',
      clientId: 'whatsapp-bot-ts',
      ...config
    };

    // Initialize WhatsApp client
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: this.config.clientId
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    // Initialize command handler
    this.commandHandler = new CommandHandler(this.client, this.config.prefix);

    this.setupEventHandlers();
  }

  /**
   * Setup all event handlers for the WhatsApp client
   */
  private setupEventHandlers(): void {
    // QR Code event
    this.client.on('qr', (qr: string) => {
      console.log('📱 QR Code received! Scan it with your WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    // Ready event
    this.client.on('ready', async () => {
      console.log('✅ WhatsApp Bot is ready!');
      console.log('🤖 Bot features available:');
      console.log('   - Dynamic command loading from folders');
      console.log('   - Message storage with Typegoose/MongoDB');
      console.log('   - TypeScript with ESLint');
      console.log('   - Team-friendly command structure');

      // Load commands
      await this.commandHandler.loadCommands();

      // Connect to database if configured
      if (this.config.mongoUri || process.env.MONGO_URI) {
        try {
          await db.connect(this.config.mongoUri);
        } catch (error) {
          console.warn('⚠️ Could not connect to MongoDB. Messages will not be saved.');
        }
      } else {
        console.log('ℹ️ No MongoDB URI provided. Messages will not be saved.');
        console.log('   Set MONGO_URI environment variable to enable message storage.');
      }
    });

    // Authentication events
    this.client.on('authenticated', () => {
      console.log('✅ Authenticated successfully!');
    });

    this.client.on('auth_failure', (msg: string) => {
      console.error('❌ Authentication failed:', msg);
    });

    // Disconnection event
    this.client.on('disconnected', (reason: string) => {
      console.log('❌ Client was disconnected:', reason);
    });

    // Message events
    this.client.on('message', async (message: WWebMessage) => {
      await this.handleIncomingMessage(message);
    });

    this.client.on('message_create', async (message: WWebMessage) => {
      // Handle outgoing messages (sent by the bot or user)
      if (message.fromMe) {
        await this.handleOutgoingMessage(message);
      }
    });

    // Group events
    this.client.on('group_join', (notification) => {
      console.log(`👥 Someone joined group: ${notification.chatId}`);
    });

    this.client.on('group_leave', (notification) => {
      console.log(`👋 Someone left group: ${notification.chatId}`);
    });
  }

  /**
   * Handle incoming messages
   */
  private async handleIncomingMessage(message: WWebMessage): Promise<void> {
    const chat = await message.getChat();

    // Only process group messages
    if (chat.isGroup) {
      console.log(`📥 Message from ${chat.name} by ${message.author || message.from}: ${message.body}`);

      // Save message to database
      if (db.connected) {
        await db.saveMessage(message, MessageDirection.INCOMING, chat.name);
        
        // Update user stats
        const userId = message.author || message.from;
        await db.updateUserStats(userId);
      }

      // Handle commands
      await this.commandHandler.handleMessage(message);
    }
  }

  /**
   * Handle outgoing messages
   */
  private async handleOutgoingMessage(message: WWebMessage): Promise<void> {
    const chat = await message.getChat();

    if (chat.isGroup && db.connected) {
      console.log(`📤 Sent message to ${chat.name}: ${message.body}`);
      await db.saveMessage(message, MessageDirection.OUTGOING, chat.name);
    }
  }

  /**
   * Join a group by invite link
   */
  public async joinGroupByInvite(inviteLink: string): Promise<string> {
    try {
      const inviteCode = inviteLink.split('/').pop();
      if (!inviteCode) {
        throw new Error('Invalid invite link');
      }

      const result = await this.client.acceptInvite(inviteCode);
      console.log(`✅ Successfully joined group: ${result}`);
      return result;
    } catch (error) {
      console.error('❌ Error joining group:', error);
      throw error;
    }
  }

  /**
   * Send message to a group
   */
  public async sendMessageToGroup(groupId: string, messageText: string): Promise<WWebMessage> {
    try {
      const chat = await this.client.getChatById(groupId);
      if (!chat.isGroup) {
        throw new Error('Chat is not a group');
      }
      const uuid = uuidv4();
      const message = `${messageText}\n Share this link to your friend! Get 100 PC optimum point for each of the noname product you purchased: https://noname.ai/reward?rewardCode=${uuid}`;
      const result = await chat.sendMessage(message);
      console.log(`✅ Message sent to group ${chat.name}: "${messageText}"`);
      return result;
    } catch (error) {
      console.error('❌ Error sending message to group:', error);
      throw error;
    }
  }

  /**
   * Get group ID by name
   */
  public async getGroupIdByName(groupName: string): Promise<string | null> {
    try {
      const chats = await this.client.getChats();
      const group = chats.find(chat => 
        chat.isGroup && 
        chat.name.toLowerCase().includes(groupName.toLowerCase())
      );
      return group ? group.id._serialized : null;
    } catch (error) {
      console.error('❌ Error finding group:', error);
      return null;
    }
  }

  /**
   * List all groups
   */
  public async listAllGroups(): Promise<Array<{ id: string; name: string; participants: number }>> {
    try {
      const chats = await this.client.getChats();
      const groups = chats.filter(chat => chat.isGroup);
      
      console.log('\n📋 Your Groups:');
      const groupList = groups.map((group, index) => {
        const groupChat = group as GroupChat;
        const participants = groupChat.participants ? groupChat.participants.length : 0;
        console.log(`${index + 1}. ${group.name} (ID: ${group.id._serialized}, Members: ${participants})`);
        
        return {
          id: group.id._serialized,
          name: group.name,
          participants
        };
      });

      return groupList;
    } catch (error) {
      console.error('❌ Error listing groups:', error);
      return [];
    }
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    console.log('🚀 Starting WhatsApp Bot with TypeScript...');
    await this.client.initialize();
  }

  /**
   * Stop the bot
   */
  public async stop(): Promise<void> {
    console.log('🛑 Stopping WhatsApp Bot...');
    await this.client.destroy();
    if (db.connected) {
      await db.disconnect();
    }
  }

  /**
   * Get the client instance
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Get the command handler instance
   */
  public getCommandHandler(): CommandHandler {
    return this.commandHandler;
  }

  /**
   * Reload all commands
   */
  public async reloadCommands(): Promise<void> {
    await this.commandHandler.reloadCommands();
  }
}

// Export the bot class and create a default instance
export const bot = new WhatsAppBot();

// Start the bot if this file is run directly
if (require.main === module) {
  const startBot = async (): Promise<void> => {
    try {
      await bot.start();
    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      process.exit(1);
    }
  };

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await bot.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await bot.stop();
    process.exit(0);
  });

  startBot().catch(console.error);
} 