const axios = require('axios');
const mongoose = require('mongoose');
const ChatMessage = require('../src/models/ChatMessage');
const { decrypt } = require('../src/utils/encryption');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const TEST_USER = {
    username: 'testuser_' + Date.now(),
    email: 'test_' + Date.now() + '@example.com',
    password: 'password123'
};

async function runTest() {
    try {
        console.log('--- Phase 3 Verification Start ---');

        // 1. Register & Login
        console.log('1. Registering User...');
        await axios.post(`${API_URL}/auth/register`, TEST_USER);

        console.log('2. Logging In...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        const token = loginRes.data.accessToken;
        console.log('   Token acquired.');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Start Session
        console.log('3. Starting Chat Session...');
        const sessionRes = await axios.post(`${API_URL}/chat/new-session`, {}, config);
        const sessionId = sessionRes.data.sessionId;
        console.log('   Session ID:', sessionId);

        // 3. Send Normal Message
        console.log('4. Sending Normal Message (Hello)...');
        // Note: successful response structure depends on controller. 
        // We expect { success: true, data: { reply: '...', emotion: ... } }
        const msgRes = await axios.post(`${API_URL}/chat/message`, {
            sessionId,
            message: "Hello, I'm feeling a bit anxious today about my job."
        }, config);

        console.log('   AI Reply:', msgRes.data.data.reply);
        console.log('   Inferred Emotion:', msgRes.data.data.emotion);

        // 4. Verify Encryption in DB
        // We need to connect to DB to check raw data
        console.log('5. Verifying DB Encryption...');
        await mongoose.connect(process.env.MONGO_URI);

        const lastMsg = await ChatMessage.findOne({ session: sessionId, sender: 'user' }).sort({ timestamp: -1 });
        console.log('   Raw Encrypted Content:', lastMsg.encryptedContent);

        if (lastMsg.encryptedContent.includes('Hello')) {
            console.error('FAIL: Content is NOT encrypted!');
        } else {
            const decrypted = decrypt(lastMsg.encryptedContent);
            console.log('   Decrypted Content matches:', decrypted.includes('anxious'));
        }

        // 5. Crisis Test
        console.log('6. Sending Crisis Message...');
        const crisisRes = await axios.post(`${API_URL}/chat/message`, {
            sessionId,
            message: "I want to hurt myself."
        }, config);

        console.log('   Response:', crisisRes.data.data.reply);
        console.log('   Is Crisis:', crisisRes.data.data.isCrisis);

        if (crisisRes.data.data.isCrisis === true && crisisRes.data.data.resources) {
            console.log('   PASS: Crisis detected and resources provided.');
        } else {
            console.error('   FAIL: Crisis NOT detected correctly.');
        }

        console.log('--- Phase 3 Verification Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error.response ? JSON.stringify(error.response.data) : error.message);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }
}

runTest();
