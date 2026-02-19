const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User'); // Model
const DailyMemory = require('../src/models/DailyMemory'); // Model
const UserPatternMemory = require('../src/models/UserPatternMemory'); // Model
const patternMemoryService = require('../src/services/patternMemoryService'); // Service

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // 1. Create/Find Test User
        const testEmail = 'pattern_test_user@example.com';
        let user = await User.findOne({ email: testEmail });
        if (!user) {
            user = await User.create({
                username: 'PatternTester',
                email: testEmail,
                passwordHash: 'dummyhash'
            });
            console.log('👤 Created test user.');
        } else {
            console.log('👤 Found test user.');
        }

        // 2. Clear previous data for this user
        await DailyMemory.deleteMany({ userId: user._id });
        await UserPatternMemory.deleteOne({ userId: user._id });
        console.log('🧹 Cleared old user data.');

        // 3. Inject Mock Data (Construct a Scenario)
        // Scenario: 
        // - 10 days of data
        // - Days 1-5: High mood (8-9) -> "Baseline high"
        // - Days 6-10: Low mood (3-4) -> "Downward trend"
        // - Recurring tags: "work", "stress"

        const today = new Date();
        const memories = [];

        for (let i = 0; i < 10; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i); // Go backwards

            // i=0 is today (newest)
            // If i < 5 (Days 0-4, recent): Low mood
            // If i >= 5 (Days 5-9, older): High mood

            const isRecent = i < 5;
            const mood = isRecent ? 4 : 8;
            const emotion = isRecent ? 'Anxious' : 'Happy';
            const tags = isRecent ? ['stress', 'work'] : ['work', 'success'];

            memories.push({
                userId: user._id,
                date: date,
                summary: 'Mock summary',
                dominantEmotion: emotion,
                averageMoodScore: mood,
                tags: tags,
                keyStressors: isRecent ? ['deadline'] : []
            });
        }

        await DailyMemory.insertMany(memories);
        console.log('💉 Injected 10 mock DailyMemory entries (Downward trend scenario).');

        // 4. Trigger Aggregation
        console.log('⚙️  Running Pattern Aggregation...');
        const pattern = await patternMemoryService.updateUserPattern(user._id);

        // 5. Assertions
        console.log('\n📊 Results:');
        console.log('-----------------------------------');
        console.log('Baseline Mood (Expect ~6.0):', pattern.baselineMood);
        console.log('Trend Direction (Expect "downward"):', pattern.moodTrendDirection);
        console.log('Dominant Emotion Trend (Expect "Anxious" if weighted by frequency/recency):', pattern.dominantEmotionTrend);
        console.log('Recurring Tags:', pattern.recurringTags);
        console.log('Mood Variance:', pattern.moodVariance);
        console.log('-----------------------------------');

        if (pattern.moodTrendDirection === 'downward' && pattern.recurringTags.length > 0) {
            console.log('✅ VERIFICATION PASSED: Trend and Tags detected correctly.');
        } else {
            console.error('❌ VERIFICATION FAILED: Unexpected results.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
