const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const ChatSession = require('../src/models/ChatSession');
const ChatMessage = require('../src/models/ChatMessage');
const DailyMemory = require('../src/models/DailyMemory');
const dailyMemoryService = require('../src/services/dailyMemoryService');
const { encrypt } = require('../src/utils/encryption');

async function verifyDailyMemory() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create Test User
        const testEmail = `memory_test_${Date.now()}@test.com`;
        const testUser = await User.create({
            email: testEmail,
            passwordHash: 'hashedpassword'
        });
        console.log('Test User Created:', testUser._id);

        // 2. Create Test Session
        const testSession = await ChatSession.create({
            user: testUser._id,
            isActive: true
        });
        console.log('Test Session Created:', testSession._id);

        // 3. Create Messages for "Yesterday"
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(12, 0, 0, 0);

        const messages = [
            { role: 'user', content: 'I felt really anxious today about my presentation.' },
            { role: 'assistant', content: 'It is normal to feel anxious. How did it go?' },
            { role: 'user', content: 'It actually went okay, but I panicked before.' }
        ];

        for (const msg of messages) {
            await ChatMessage.create({
                session: testSession._id,
                sender: msg.role,
                encryptedContent: encrypt(msg.content),
                timestamp: yesterday
            });
        }
        console.log('Created 3 messages for yesterday');

        // 4. Trigger Daily Memory Generation
        console.log('Triggering Daily Memory generation...');
        const memory = await dailyMemoryService.createDailyMemory(testUser._id, yesterday);

        if (!memory) {
            throw new Error('Failed to generate daily memory');
        }

        console.log('Daily Memory Generated ID:', memory._id);

        // 5. Verify Encryption in DB
        const rawMemory = await DailyMemory.findById(memory._id);
        if (!rawMemory.summary.includes(':')) { // Basic check for IV:Ciphertext format
            throw new Error('Summary does not appear to be encrypted');
        }
        console.log('Encryption Verified. Raw Summary:', rawMemory.summary.substring(0, 20) + '...');

        // 6. Verify Duplicate Prevention
        console.log('Attempting duplicate generation...');
        const duplicate = await dailyMemoryService.createDailyMemory(testUser._id, yesterday);
        if (duplicate._id.toString() !== memory._id.toString()) {
            throw new Error('Duplicate prevention failed! Created new ID: ' + duplicate._id);
        }
        console.log('Duplicate Prevention Verified (Returned existing ID)');

        console.log('VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('VERIFICATION FAILED FULL ERROR:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

verifyDailyMemory().catch(err => {
    console.error('Unhandled Script Error:', err);
    process.exit(1);
});
