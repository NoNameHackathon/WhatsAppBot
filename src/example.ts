import { WhatsAppBot } from './bot';
import { IBotConfig } from './types';

// Example configuration
const config: Partial<IBotConfig> = {
  prefix: '!',
  clientId: 'example-bot',
  mongoUri: process.env.MONGO_URI // Optional: set for message storage
};

// Create bot instance
const exampleBot = new WhatsAppBot(config);

// Wait for the bot to be ready
exampleBot.getClient().on('ready', async () => {
  console.log('🤖 Example bot is ready! Running examples...\n');
  
  try {
    // Example 1: List all groups
    console.log('📋 Example 1: Listing all groups');
    const groups = await exampleBot.listAllGroups();
    
    if (groups.length > 0) {
      // Example 2: Get group ID by name and send message
      console.log('\n💬 Example 2: Sending message to first group');
      const firstGroup = groups[0];
      await exampleBot.sendMessageToGroup(firstGroup.id, '🤖 Hello from TypeScript bot! This is an example message.');
      
      // Example 3: Find group by name
      console.log('\n🔍 Example 3: Finding group by name');
      const groupId = await exampleBot.getGroupIdByName(firstGroup.name);
      console.log(`Found group ID for "${firstGroup.name}": ${groupId}`);
    }
    
    // Example 4: Join group by invite (uncomment and replace with actual invite link)
    /*
    console.log('\n👥 Example 4: Joining group by invite');
    const inviteLink = 'https://chat.whatsapp.com/YOUR_INVITE_CODE_HERE';
    await exampleBot.joinGroupByInvite(inviteLink);
    */
    
    console.log('\n✅ Examples completed!');
    console.log('\n💡 Tips:');
    console.log('   - Commands are loaded from src/commands/ folders');
    console.log('   - Try sending "!help" in any group');
    console.log('   - Messages are automatically saved to MongoDB if configured');
    console.log('   - Use Ctrl+C to stop the bot gracefully');
    
  } catch (error) {
    console.error('❌ Error in examples:', error);
  }
});

// Error handling
exampleBot.getClient().on('auth_failure', () => {
  console.error('❌ Authentication failed in example bot');
});

exampleBot.getClient().on('disconnected', () => {
  console.log('❌ Example bot disconnected');
});

// Start the example bot
console.log('🚀 Starting TypeScript WhatsApp Bot example...');
console.log('📱 Please scan the QR code with your WhatsApp to continue...\n');

exampleBot.start().catch((error) => {
  console.error('❌ Failed to start example bot:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down example bot...');
  await exampleBot.stop();
  process.exit(0);
}); 