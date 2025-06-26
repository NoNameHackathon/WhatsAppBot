import { Message, Chat, Client } from 'whatsapp-web.js';

export interface IBotCommand {
  name: string;
  description: string;
  aliases?: string[];
  category?: string;
  execute: (message: Message, args: string[], client: Client) => Promise<void>;
}

export interface ICommandContext {
  message: Message;
  args: string[];
  client: Client;
  chat: Chat;
  author: string;
}

export interface IBotConfig {
  prefix: string;
  mongoUri?: string;
  clientId: string;
}

export interface IGroupInfo {
  id: string;
  name: string;
  participantCount: number;
  description?: string;
  createdAt?: Date;
}

export interface IMessageData {
  id: string;
  body: string;
  from: string;
  to: string;
  timestamp: number;
  author?: string;
  chatId: string;
  chatName?: string;
  isGroup: boolean;
  messageType: string;
  hasMedia: boolean;
  isForwarded: boolean;
}

export interface IUserStats {
  userId: string;
  username?: string;
  messageCount: number;
  lastSeen: Date;
  joinedGroups: string[];
}

export enum MessageDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

export enum CommandCategory {
  GENERAL = 'general',
  GROUP = 'group',
  ADMIN = 'admin',
  FUN = 'fun',
  UTILITY = 'utility'
} 