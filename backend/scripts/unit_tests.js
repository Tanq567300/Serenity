// Mocks for testing environment
process.env.ENCRYPTION_SECRET = '12345678901234567890123456789012'; // 32 chars
process.env.GEMINI_API_KEY = 'mock-gemini-key';

const encryption = require('../src/utils/encryption');
const crisisService = require('../src/services/crisisService');
const emotionService = require('../src/services/emotionService');
const aiService = require('../src/services/aiService'); // Mock this

// Mock console.log/error to clean output? No need.

const runUnitTests = async () => {
    console.log('--- Phase 3 Component Unit Tests ---');
    let failures = 0;

    // 1. Encryption Test
    console.log('\n[Encryption Utility]');
    try {
        const original = "Hello World Secret Message";
        console.log(`Original: "${original}"`);
        const encrypted = encryption.encrypt(original);
        console.log(`Encrypted: "${encrypted}"`);

        if (encrypted === original) throw new Error('Encryption returned plaintext');
        if (!encrypted.includes(':')) throw new Error('Invalid format (missing IV)');

        const decrypted = encryption.decrypt(encrypted);
        console.log(`Decrypted: "${decrypted}"`);

        if (decrypted !== original) throw new Error('Decryption failed to match original');
        console.log('✅ Encryption Test Passed');
    } catch (e) {
        console.error('❌ Encryption Test Failed:', e.message);
        failures++;
    }

    // 2. Crisis Detection Test
    console.log('\n[Crisis Detection Service]');
    try {
        const safeMsg = "I am sad";
        const crisisMsg = "I want to kill myself";

        const res1 = crisisService.detectCrisis(safeMsg);
        if (res1.isCrisis) throw new Error(`Safe message flagged as crisis: "${safeMsg}"`);

        const res2 = crisisService.detectCrisis(crisisMsg);
        if (!res2.isCrisis) throw new Error(`Crisis message NOT flagged: "${crisisMsg}"`);

        console.log('✅ Crisis Detection Passed');
    } catch (e) {
        console.error('❌ Crisis Detection Failed:', e.message);
        failures++;
    }

    // 3. Emotion Inference Test
    console.log('\n[Emotion Inference Service]');
    try {
        const happyMsg = "I am so happy and excited!";
        const sadMsg = "I feel depressed and lonely";

        const res1 = await emotionService.inferEmotion(happyMsg);
        if (res1.emotion !== 'joy' || res1.moodScore !== 5) throw new Error(`Failed happy detection: ${JSON.stringify(res1)}`);

        const res2 = await emotionService.inferEmotion(sadMsg);
        if (res2.emotion !== 'sadness' || res2.moodScore !== 1) throw new Error(`Failed sad detection: ${JSON.stringify(res2)}`);

        console.log('✅ Emotion Inference Passed');
    } catch (e) {
        console.error('❌ Emotion Inference Failed:', e.message);
        failures++;
    }

    // 4. Chat Service (Mocked)? 
    // We can't easily test chatService without DB mocks (mongoose).
    // Skipping integration logic here as dependent on DB.

    console.log('\n--- Test Summary ---');
    if (failures === 0) {
        console.log('All Component Tests Passed (Integration skipped due to DB connectivity)');
    } else {
        console.log(`${failures} Tests Failed`);
        process.exit(1);
    }
};

runUnitTests();
