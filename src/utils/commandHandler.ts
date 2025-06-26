import { readdirSync } from 'fs';
import { join } from 'path';
import { Client, Message } from 'whatsapp-web.js';
import { IBotCommand } from '../types';

export class CommandHandler {
  private commands: Map<string, IBotCommand> = new Map();
  private aliases: Map<string, string> = new Map();

  constructor(private client: Client, private prefix: string = '!') {}

  /**
   * Load all commands from the commands directory
   */
  public async loadCommands(): Promise<void> {
    const commandsPath = join(__dirname, '../commands');
    
    try {
      const commandFolders = readdirSync(commandsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const folder of commandFolders) {
        const folderPath = join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath)
          .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
          try {
            const commandPath = join(folderPath, file);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commandModule = require(commandPath);
            const command: IBotCommand = commandModule.default || commandModule;

            if (this.isValidCommand(command)) {
              this.commands.set(command.name.toLowerCase(), command);
              
              // Register aliases
              if (command.aliases) {
                for (const alias of command.aliases) {
                  this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
                }
              }

              console.log(`✅ Loaded command: ${command.name} (${folder})`);
            } else {
              console.warn(`⚠️ Invalid command structure in file: ${file}`);
            }
          } catch (error) {
            console.error(`❌ Error loading command from ${file}:`, error);
          }
        }
      }

      console.log(`📋 Loaded ${this.commands.size} commands total`);
    } catch (error) {
      console.error('❌ Error loading commands directory:', error);
    }
  }

  /**
   * Handle incoming message and execute command if applicable
   */
  public async handleMessage(message: Message): Promise<void> {
    const chat = await message.getChat();
    
    // Only process group messages that start with prefix
    if (!chat.isGroup || !message.body.startsWith(this.prefix)) {
      return;
    }

    const args = message.body.slice(this.prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Check if command exists (including aliases)
    const actualCommandName = this.aliases.get(commandName) || commandName;
    const command = this.commands.get(actualCommandName);

    if (!command) return;

    try {
      console.log(`🤖 Executing command: ${command.name} in group: ${chat.name}`);
      await command.execute(message, args, this.client);
    } catch (error) {
      console.error(`❌ Error executing command ${command.name}:`, error);
      await message.reply('❌ An error occurred while executing this command.');
    }
  }

  /**
   * Get all loaded commands
   */
  public getCommands(): Map<string, IBotCommand> {
    return this.commands;
  }

  /**
   * Get commands by category
   */
  public getCommandsByCategory(category: string): IBotCommand[] {
    return Array.from(this.commands.values())
      .filter(command => command.category === category);
  }

  /**
   * Validate command structure
   */
  private isValidCommand(command: unknown): command is IBotCommand {
    return (
      typeof command === 'object' &&
      command !== null &&
      'name' in command &&
      'description' in command &&
      'execute' in command &&
      typeof (command as IBotCommand).name === 'string' &&
      typeof (command as IBotCommand).description === 'string' &&
      typeof (command as IBotCommand).execute === 'function'
    );
  }

  /**
   * Reload all commands
   */
  public async reloadCommands(): Promise<void> {
    this.commands.clear();
    this.aliases.clear();
    await this.loadCommands();
  }
} 