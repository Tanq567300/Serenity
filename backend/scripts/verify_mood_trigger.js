const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const dailyMemoryService = require('../src/services/dailyMemoryService');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => new Promise(resolve => rl.question(query, resolve));

async function run() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // 1. Get User
        const email = await ask('Enter the email of the user to generate memory for: ');
        const user = await User.findOne({ email });

        if (!user) {
            console.error('❌ User not found!');
            process.exit(1);
        }

        console.log(`👤 Found user: ${user.username} (${user._id})`);

        // 2. Get Date
        // Default to today
        const today = new Date();
        console.log(`📅 Generating memory for today: ${today.toDateString()}`);
        console.log('⚠️  Note: This will fail if a memory already exists for today.');

        const confirm = await ask('Proceed? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            process.exit(0);
        }

        // 3. Trigger
        console.log('🧠 Generating Dynamic Memory...');
        const memory = await dailyMemoryService.createDailyMemory(user._id, today);

        if (memory) {
            console.log('\n✨ SUCCESS! Memory Generated:');
            console.log('-----------------------------------');
            console.log('Emotion:', memory.dominantEmotion);
            console.log('Score:', memory.averageMoodScore);
            console.log('Stressors:', memory.keyStressors.join(', '));
            console.log('Summary (Encrypted length):', memory.summary.length);
            console.log('-----------------------------------');
            console.log('Go to "Chat" in the app, click "Next Day" (>) to see it!');
        } else {
            console.log('\n⚠️  No memory generated. Either:');
            console.log('1. A memory already exists for this date.');
            console.log('2. No chat messages or mood logs found for this date.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        rl.close();
        process.exit(0);
    }
}

run();
