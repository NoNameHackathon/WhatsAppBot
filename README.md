# WhatsApp Group Bot (TypeScript) 🤖

A professional WhatsApp bot built with **TypeScript**, [whatsapp-web.js](https://docs.wwebjs.dev/), **Typegoose**, and **MongoDB** that can join groups, send messages to groups, and receive messages from groups with a team-friendly command structure.

## ✨ Features

- ✅ **TypeScript** - Full type safety and modern development experience
- ✅ **ESLint** - Code linting and formatting for team collaboration
- ✅ **Command System** - Organized command structure for team development
- ✅ **Database Storage** - Message logging with Typegoose and MongoDB
- ✅ **Join Groups by Invite Link** - Automatically join WhatsApp groups
- ✅ **Send Messages to Groups** - Send messages programmatically
- ✅ **Receive Messages from Groups** - Listen to and respond to group messages
- ✅ **Dynamic Command Loading** - Load commands from organized folders
- ✅ **Hot Reload** - Development with nodemon for instant restarts
- ✅ **Production Ready** - Build process and production scripts

## 📋 Prerequisites

- **Node.js v18+** (required for whatsapp-web.js)
- **MongoDB** (optional, for message storage)
- **WhatsApp account**
- **Chrome/Chromium browser** (automatically handled by Puppeteer)

## 🚀 Installation

1. **Clone this project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Run the bot:**
   ```bash
   # Development mode (with hot reload)
   npm run dev

   # Or start normally
   npm start
   ```

5. **Scan the QR code** that appears in your terminal with WhatsApp mobile app

## 📱 Usage

### Basic Bot Usage

Once running, the bot will:
1. **Load all commands** from `src/commands/` folders
2. **Connect to MongoDB** (if configured) to save messages
3. **Listen to group messages** and respond to commands
4. **Log all activities** with detailed information

### Available Commands

Send these in any group where the bot is present:

| Command | Description | Aliases |
|---------|-------------|---------|
| `!help` | Show all commands | `!h`, `!commands` |
| `!ping` | Test bot response time | `!pong` |
| `!info` | Show group information | `!groupinfo`, `!gi` |
| `!groups` | List all groups | `!grouplist`, `!gl` |
| `!time` | Show current time | `!date`, `!now` |

### Team Development

#### Adding New Commands

1. **Choose a category** (or create new folder in `src/commands/`)
2. **Create command file** (e.g., `src/commands/utility/weather.ts`)
3. **Follow the command interface:**

```typescript
import { Message, Client } from 'whatsapp-web.js';
import { IBotCommand, CommandCategory } from '../../types';

const weatherCommand: IBotCommand = {
  name: 'weather',
  description: 'Get weather information for a city',
  aliases: ['w'],
  category: CommandCategory.UTILITY,
  
  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const city = args.join(' ');
    if (!city) {
      await message.reply('❌ Please provide a city name!');
      return;
    }
    
    // Your command logic here
    await message.reply(`🌤️ Weather for ${city}: ...`);
  }
};

export default weatherCommand;
```

4. **Commands are automatically loaded** - no registration needed!

## 🛠️ Development Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm run start:prod

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build files
npm run clean

# Run examples
npm run example
```

## 📁 Project Structure

```
src/
├── commands/           # Command categories
│   ├── general/        # General commands (help, ping)
│   ├── group/          # Group-specific commands
│   ├── admin/          # Admin commands
│   └── utility/        # Utility commands
├── models/             # Typegoose models
│   ├── Message.ts      # Message storage model
│   └── User.ts         # User statistics model
├── types/              # TypeScript interfaces
│   └── index.ts        # Bot interfaces and types
├── utils/              # Utilities
│   ├── commandHandler.ts  # Command loading system
│   └── database.ts        # Database management
├── bot.ts              # Main bot class
└── example.ts          # Example usage
```

## 🗄️ Database Features

### Message Storage
All group messages are automatically saved to MongoDB with:
- Message content and metadata
- User information and statistics
- Media information (type, size)
- Group and chat details
- Timestamps and direction (incoming/outgoing)

### User Statistics
Track user activity including:
- Message count per user
- Last seen timestamps
- Groups joined
- Profile information

### Database Models

```typescript
// Messages are saved with full metadata
interface MessageModel {
  messageId: string;
  body: string;
  from: string;
  to: string;
  chatId: string;
  chatName?: string;
  author?: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
  isGroup: boolean;
  messageType: string;
  hasMedia: boolean;
  // ... and more
}
```

## 🔧 Configuration

### Environment Variables

```bash
# .env file
MONGO_URI=mongodb://localhost:27017/whatsapp-bot
BOT_PREFIX=!
BOT_CLIENT_ID=whatsapp-bot-ts
NODE_ENV=development
```

### Programmatic Configuration

```typescript
import { WhatsAppBot } from './src/bot';

const bot = new WhatsAppBot({
  prefix: '!',
  clientId: 'my-bot',
  mongoUri: 'mongodb://localhost:27017/my-db'
});

await bot.start();
```

## 🎯 Core Functions

### 1. Join Group by Invite Link
```typescript
await bot.joinGroupByInvite('https://chat.whatsapp.com/INVITE_CODE');
```

### 2. Send Message to Group
```typescript
// Using group ID
await bot.sendMessageToGroup('GROUP_ID', 'Hello group!');

// Or find by name first
const groupId = await bot.getGroupIdByName('My Group');
await bot.sendMessageToGroup(groupId, 'Hello!');
```

### 3. List All Groups
```typescript
const groups = await bot.listAllGroups();
// Returns: [{ id, name, participants }]
```

## 🐳 Production Deployment

### Docker Setup (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["npm", "run", "start:prod"]
```

### Build for Production

```bash
# Install dependencies
npm ci

# Build TypeScript
npm run build

# Start production server
npm run start:prod
```

## 🧪 Development Workflow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Create new command:**
   - Add file to appropriate `src/commands/` folder
   - Follow command interface
   - Test immediately (hot reload enabled)

3. **Run linting:**
   ```bash
   npm run lint:fix
   ```

4. **Test with examples:**
   ```bash
   npm run example
   ```

## ⚠️ Important Notes

1. **WhatsApp Terms**: Uses WhatsApp Web (unofficial for bots) - use responsibly
2. **Rate Limiting**: Don't send messages too frequently to avoid blocks
3. **Session Persistence**: Authentication saved in `.wwebjs_auth/` folder
4. **Database**: Optional but recommended for message history
5. **Team Development**: Use Git branches for new features/commands

## 🔒 Security Best Practices

- Store sensitive data in environment variables
- Don't commit `.env` or `.wwebjs_auth/` to version control
- Use different `clientId` for different environments
- Regularly update dependencies
- Monitor message storage for privacy compliance

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| QR Code not appearing | Check terminal supports Unicode |
| TypeScript errors | Run `npm run lint:fix` |
| Database connection fails | Check MongoDB URI and service |
| Commands not loading | Check command file structure |
| Authentication failed | Delete `.wwebjs_auth/` and restart |

### Debug Mode

```bash
DEBUG=puppeteer:* npm run dev
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/new-command`
3. **Add your command** in appropriate category folder
4. **Run linting:** `npm run lint:fix`
5. **Test thoroughly**
6. **Submit pull request**

### Command Guidelines
- Use TypeScript interfaces
- Add proper error handling
- Include helpful error messages
- Follow naming conventions
- Add aliases for common commands

## 📈 Advanced Features

### Custom Command Categories
```typescript
// Add to src/types/index.ts
export enum CommandCategory {
  MODERATION = 'moderation',
  ENTERTAINMENT = 'entertainment'
}
```

### Database Queries
```typescript
import { Message } from './src/models/Message';

// Get messages from specific group
const messages = await Message.find({ 
  chatId: 'group-id',
  direction: 'incoming' 
}).limit(100);
```

### Event Handling
```typescript
bot.getClient().on('group_join', (notification) => {
  console.log('New member joined!');
});
```

## 📄 License

MIT License - Educational/development purposes. Please respect WhatsApp's terms of service.

---

**🎉 Happy Coding with TypeScript!**

For advanced features and API documentation, visit [whatsapp-web.js docs](https://docs.wwebjs.dev/). 