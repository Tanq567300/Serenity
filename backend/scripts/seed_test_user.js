const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../src/models/User');
const DailyMemory = require('../src/models/DailyMemory');
const { encrypt } = require('../src/utils/encryption');

dotenv.config({ path: path.join(__dirname, '../.env') });

const emotions = ['happy', 'excited', 'calm', 'anxious', 'sad', 'frustrated', 'grateful', 'tired'];
const tagsList = ['work', 'family', 'health', 'sleep', 'exercise', 'nature', 'coding', 'social'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomTags = () => {
    const numTags = getRandomInt(1, 3);
    const shuffled = tagsList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create Test User
        const email = 'testuser@serenity.com';
        const password = 'password123';

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists, updating...');
        } else {
            console.log('Creating new user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await User.create({
                email,
                passwordHash: hashedPassword,
            });
        }

        // 2. Clear existing memories for this user
        await DailyMemory.deleteMany({ userId: user._id });
        console.log('Cleared existing memories');

        // 3. Generate 30 days of memories
        const memories = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const moodScore = getRandomInt(1, 10);
            const emotion = getRandomItem(emotions);
            const tags = getRandomTags();

            const summaryText = `Journal entry for ${date.toDateString()}. I felt ${emotion} today. My mood was a ${moodScore}. I focused on ${tags.join(', ')}. It was a ${moodScore > 5 ? 'good' : 'challenging'} day overall.`;

            memories.push({
                userId: user._id,
                date: date,
                summary: encrypt(summaryText),
                dominantEmotion: emotion,
                averageMoodScore: moodScore,
                tags: tags,
                keyStressors: moodScore < 5 ? ['work', 'traffic'] : [],
                createdAt: date
            });
        }

        await DailyMemory.insertMany(memories);
        console.log(`Successfully seeded ${memories.length} daily memories for ${user.email}`);
        console.log('Login credentials:');
        console.log('Email:', email);
        console.log('Password:', password);

        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
