const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const DailyMemory = require('../src/models/DailyMemory');
const UserPatternMemory = require('../src/models/UserPatternMemory');
const patternMemoryService = require('../src/services/patternMemoryService');
const { encrypt } = require('../src/utils/encryption');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_USER = {
    email: 'demo@pattern.com',
    password: 'Pattern123!',
    username: 'DemoUser'
};

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // 1. Create Demo User
        let user = await User.findOne({ email: DEMO_USER.email });
        if (user) {
            console.log('👤 Found existing demo user. Resetting password...');
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(DEMO_USER.password, salt);
            await user.save();
        } else {
            console.log('👤 Creating new demo user...');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(DEMO_USER.password, salt);
            user = await User.create({
                username: DEMO_USER.username,
                email: DEMO_USER.email,
                passwordHash
            });
        }
        console.log(`🔑 Credentials: ${DEMO_USER.email} / ${DEMO_USER.password}`);

        // 2. Clear old data
        await DailyMemory.deleteMany({ userId: user._id });
        await UserPatternMemory.deleteOne({ userId: user._id });
        console.log('🧹 Cleared old demo data.');

        // 3. Inject 14 Days of History
        // Scenario: "Busy Work Week -> Relaxed Weekend -> Stressful Deadline"
        const entries = [];
        const today = new Date();

        // Helper to create entry
        const addEntry = (daysAgo, mood, emotion, summary, tags, stressors = []) => {
            const date = new Date(today);
            date.setDate(today.getDate() - daysAgo);

            // Randomize time slightly within that day
            date.setHours(20, Math.floor(Math.random() * 60));

            entries.push({
                userId: user._id,
                date: date,
                summary: encrypt(summary), // Must be encrypted for the app to read it
                dominantEmotion: emotion,
                averageMoodScore: mood,
                tags: tags,
                keyStressors: stressors
            });
        };

        console.log('📝 Generating 14 days of journal history...');

        // Week 1: Mixed / Okay
        addEntry(13, 7, 'Content', 'Had a quiet day reading.', ['leisure', 'reading']);
        addEntry(12, 6, 'Tired', 'Long day at work but productive.', ['work', 'tired']);
        addEntry(11, 8, 'Excited', 'Started a new project!', ['work', 'project', 'new']);
        addEntry(10, 5, 'Bored', 'Nothing strict happened today.', ['routine']);
        addEntry(9, 4, 'Anxious', 'Worried about upcoming deadlines.', ['work', 'anxiety'], ['deadline']);
        addEntry(8, 7, 'Relieved', 'Finished the big task.', ['work', 'success']);
        addEntry(7, 9, 'Happy', 'Great weekend hike with friends.', ['social', 'nature'], []);

        // Week 2: Stress building up then resolving
        addEntry(6, 8, 'Calm', 'Sunday reset, meal prepped.', ['chore', 'sunday']);
        addEntry(5, 7, 'Focused', 'Deep work mode on.', ['work', 'focus']);
        addEntry(4, 5, 'Frustrated', 'Blockers in the project.', ['work', 'blocker'], ['tech issues']);
        addEntry(3, 4, 'Stressed', 'Deadline creates pressure.', ['work', 'stress'], ['deadline']);
        addEntry(2, 3, 'Overwhelmed', 'Too much to do, too little time.', ['work', 'burnout'], ['workload', 'deadline']);
        addEntry(1, 6, 'Hopeful', 'Managed to get help, feeling better.', ['support', 'work']);
        addEntry(0, 8, 'Grateful', 'Project delivered! Time to rest.', ['success', 'rest', 'gratitude']);

        await DailyMemory.insertMany(entries);
        console.log(`✅ Inserted ${entries.length} journal entries.`);

        // 4. Trigger Pattern Engine
        console.log('⚙️  Calculating Patterns...');
        const pattern = await patternMemoryService.updateUserPattern(user._id);

        console.log('\n📊 Insight Generated:');
        console.log(`   - Baseline Mood: ${pattern.baselineMood.toFixed(1)}`);
        console.log(`   - Trend: ${pattern.moodTrendDirection.toUpperCase()}`);
        console.log(`   - Dominant Emotion: ${pattern.dominantEmotionTrend}`);
        console.log(`   - Recurring Tags: ${pattern.recurringTags.join(', ')}`);

        console.log('\n🎉 DEMO READY!');
        console.log('---------------------------------------------------');
        console.log('1. Log out of your current user.');
        console.log(`2. Log in with: ${DEMO_USER.email}`);
        console.log(`3. Password:    ${DEMO_USER.password}`);
        console.log('4. Go to "Insights" tab to see the patterns.');
        console.log('---------------------------------------------------');

    } catch (error) {
        console.error('❌ Error seeding demo data:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
