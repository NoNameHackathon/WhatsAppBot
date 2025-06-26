import express from 'express';
import { bot } from './bot';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Simple HTML page
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Bot Inviter</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .emoji {
            font-size: 3em;
            text-align: center;
            margin-bottom: 20px;
        }
        form {
            margin-bottom: 30px;
        }
        label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
        }
        input[type="url"] {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 20px;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        }
        button {
            width: 100%;
            padding: 15px;
            background: #25d366;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #20c157;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
        }
        .success {
            background: rgba(76, 175, 80, 0.3);
            border: 2px solid #4caf50;
        }
        .error {
            background: rgba(244, 67, 54, 0.3);
            border: 2px solid #f44336;
        }
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .steps {
            text-align: left;
            margin-top: 20px;
        }
        .steps li {
            margin-bottom: 10px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🤖</div>
        <h1>WhatsApp Bot Inviter</h1>
        
        <form id="inviteForm">
            <label for="inviteLink">Group Invite Link:</label>
            <input 
                type="url" 
                id="inviteLink" 
                name="inviteLink" 
                placeholder="https://chat.whatsapp.com/..." 
                required
            >
            <button type="submit" id="submitBtn">Invite Bot to Group</button>
        </form>
        
        <div id="status"></div>
        
        <div class="info">
            <h3>📋 How to use:</h3>
            <ol class="steps">
                <li>Open your WhatsApp group</li>
                <li>Tap the group name at the top</li>
                <li>Tap "Invite to Group via Link"</li>
                <li>Copy the invite link</li>
                <li>Paste it above and click "Invite Bot"</li>
            </ol>
            
            <h3>🎯 Available Commands:</h3>
            <ul class="steps">
                <li><strong>!help</strong> - Show all commands</li>
                <li><strong>!ping</strong> - Test bot response</li>
                <li><strong>!info</strong> - Group information</li>
                <li><strong>!time</strong> - Current time</li>
            </ul>
        </div>
    </div>

    <script>
        document.getElementById('inviteForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const statusDiv = document.getElementById('status');
            const inviteLink = document.getElementById('inviteLink').value;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Inviting Bot...';
            statusDiv.innerHTML = '';
            
            try {
                const response = await fetch('/invite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ inviteLink })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    statusDiv.innerHTML = '<div class="status success">✅ ' + result.message + '</div>';
                    document.getElementById('inviteLink').value = '';
                } else {
                    statusDiv.innerHTML = '<div class="status error">❌ ' + result.message + '</div>';
                }
            } catch (error) {
                statusDiv.innerHTML = '<div class="status error">❌ Network error. Please try again.</div>';
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Invite Bot to Group';
            }
        });
    </script>
</body>
</html>
`;

// Routes
app.get('/', (_req, res) => {
    res.send(HTML_PAGE);
});

app.post('/invite', async (req, res) => {
    const { inviteLink } = req.body;
    
    if (!inviteLink) {
        return res.json({
            success: false,
            message: 'Please provide an invite link'
        });
    }
    
    // Validate WhatsApp invite link format
    if (!inviteLink.includes('chat.whatsapp.com/')) {
        return res.json({
            success: false,
            message: 'Invalid WhatsApp invite link format'
        });
    }
    
    try {
        console.log(`🔗 Attempting to join group via invite: ${inviteLink}`);
        const result = await bot.joinGroupByInvite(inviteLink);
        
        return res.json({
            success: true,
            message: `Successfully joined group! Group ID: ${result}`
        });
    } catch (error) {
        console.error('❌ Error joining group:', error);
        
        let errorMessage = 'Failed to join group';
        if (error instanceof Error) {
            if (error.message.includes('Invalid invite link')) {
                errorMessage = 'Invalid or expired invite link';
            } else if (error.message.includes('already a participant')) {
                errorMessage = 'Bot is already in this group';
            } else {
                errorMessage = error.message;
            }
        }
        
        return res.json({
            success: false,
            message: errorMessage
        });
    }
});

// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        bot_ready: bot.getClient().info ? true : false
    });
});

// Start the web server
async function startWebServer() {
    // First ensure the bot is ready
    console.log('🔗 Starting web server for bot invitations...');
    
    app.listen(PORT, () => {
        console.log(`\n🌐 Web server running at: http://localhost:${PORT}`);
        console.log('📱 Users can now invite the bot via the web interface!');
        console.log('🔧 Health check available at: http://localhost:${PORT}/health\n');
    });
}

// Start both bot and web server
async function startEverything() {
    try {
        // Start the WhatsApp bot first
        console.log('🤖 Starting WhatsApp bot...');
        await bot.start();
        
        // Wait a bit for bot to be ready, then start web server
        setTimeout(startWebServer, 3000);
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down web server and bot...');
    await bot.stop();
    process.exit(0);
});

// Start everything if this file is run directly
if (require.main === module) {
    startEverything().catch(console.error);
}

export { app, startWebServer }; 