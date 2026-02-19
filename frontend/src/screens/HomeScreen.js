import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../stores/authStore';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const userName = user?.name || 'Abhinav'; // Placeholder if name missing

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Top Bar */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandText}>SERENITY</Text>
                        <Text style={styles.greetingText}>Good Morning, {userName}</Text>
                    </View>
                    <View style={styles.profileImageContainer}>
                        {/* Placeholder Image */}
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFWDxMWy5qHcRG6uajml4aSDOHROvpkpuQxlscGWLee5MCYFoSHdSno2yBtF570LevKt-jwQjdiitiTO_INS18kwJ6z0bIHttf8AiHc4NFniaFHzpsEBelhr21JUomsi8m8Fm6n9z7v6-5j5A7uf5H73uUDtMfuJdouO_L1N_7It7ZS__A9vPedXEQIWUD7O09nNWUBbOSbJvA2YiSr-8rD-KvU1_XhaIUXdAqGnV0BAmwpYp8x3QMhMRQVDXv7DjnBXlbcSrNxW6b' }}
                            style={styles.profileImage}
                        />
                    </View>
                </View>

                {/* Mood Score Section */}
                <View style={styles.moodSection}>
                    <View style={styles.moodRingContainer}>
                        <Svg height="250" width="250" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                            <Circle cx="50" cy="50" r="45" stroke="#e8f3e8" strokeWidth="4" fill="none" />
                            <Circle
                                cx="50" cy="50" r="45"
                                stroke="#36e236"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray="282.7"
                                strokeDashoffset="62.2" // 78% roughly
                                strokeLinecap="round"
                            />
                        </Svg>
                        <View style={styles.moodTextContainer}>
                            <Text style={styles.moodScore}>78</Text>
                            <Text style={styles.moodLabel}>MOOD SCORE</Text>
                        </View>
                        {/* Soft Glow mimicking CSS blur - simplified for RN */}
                        <View style={styles.glowEffect} />
                    </View>
                    <Text style={styles.quoteText}>
                        "You're doing great today. Your mindfulness is paying off."
                    </Text>
                </View>

                {/* AI Guide Section */}
                <View style={styles.aiGuideContainer}>
                    <View style={styles.aiGuideContent}>
                        <View style={styles.aiIconContainer}>
                            <MaterialIcons name="auto-awesome" size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.aiGuideTitle}>Always-On AI Guide</Text>
                            <Text style={styles.aiGuideQuestion}>How are you feeling right now, {userName}?</Text>
                        </View>
                    </View>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "I'm feeling calm" })}>
                            <Text style={styles.quickActionText}>I'm feeling calm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "A bit anxious" })}>
                            <Text style={styles.quickActionText}>A bit anxious</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mood Journal Section */}
                <View style={styles.journalSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mood Journal</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
                            <Text style={styles.viewAllText}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Journal Card 1 */}
                    <View style={styles.journalCard}>
                        <View style={[styles.journalIconContainer, { backgroundColor: '#f3e8f3' }]}>
                            <MaterialIcons name="wb-twilight" size={24} color="#907090" />
                        </View>
                        <View style={styles.journalContent}>
                            <View style={styles.journalHeader}>
                                <Text style={styles.journalTitle}>Morning Reflection</Text>
                                <Text style={styles.journalTime}>08:30 AM</Text>
                            </View>
                            <Text style={styles.journalPreview} numberOfLines={1}>
                                Calm and focused today...
                            </Text>
                        </View>
                    </View>

                    {/* Journal Card 2 */}
                    <View style={styles.journalCard}>
                        <View style={[styles.journalIconContainer, { backgroundColor: '#e8f3e8' }]}>
                            <MaterialIcons name="favorite" size={24} color="#509550" />
                        </View>
                        <View style={styles.journalContent}>
                            <View style={styles.journalHeader}>
                                <Text style={styles.journalTitle}>Gratitude List</Text>
                                <Text style={styles.journalTime}>Yesterday</Text>
                            </View>
                            <Text style={styles.journalPreview} numberOfLines={1}>
                                I am thankful for the morning sun...
                            </Text>
                        </View>
                    </View>

                    {/* Add New Entry Prompt */}
                    <TouchableOpacity style={styles.addEntryCard} onPress={() => navigation.navigate('Chat')}>
                        <MaterialIcons name="add-circle-outline" size={32} color="#509550" style={{ opacity: 0.6 }} />
                        <Text style={styles.addEntryText}>ADD NEW JOURNAL ENTRY</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Chat Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Chat')}
            >
                <MaterialIcons name="chat-bubble" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfcfb', // background-light
    },
    scrollContent: {
        paddingBottom: 100, // Space for Bottom Tab
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    brandText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(80, 149, 80, 0.7)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    greetingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0e1b0e',
    },
    profileImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f3e8',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    moodSection: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    moodRingContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    moodTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        // Shadow/Glow
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    moodScore: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#0e1b0e',
    },
    moodLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#509550',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    quoteText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    aiGuideContainer: {
        marginHorizontal: 24,
        padding: 20,
        backgroundColor: 'rgba(232, 243, 232, 0.4)', // sage/40
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fff',
        marginBottom: 24,
    },
    aiGuideContent: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    aiIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#36e236', // primary
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: 'rgba(54, 226, 54, 0.3)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    aiGuideTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0e1b0e',
        marginBottom: 4,
    },
    aiGuideQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2e1a', // slightly darker sage
        lineHeight: 22,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 8,
    },
    quickActionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e8f3e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#509550',
    },
    journalSection: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0e1b0e',
    },
    viewAllText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#36e236',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    journalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e8f3e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    journalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    journalContent: {
        flex: 1,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    journalTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0e1b0e',
    },
    journalTime: {
        fontSize: 10,
        fontWeight: '500',
        color: '#9ca3af',
    },
    journalPreview: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
    },
    addEntryCard: {
        borderWidth: 2,
        borderColor: 'rgba(232, 243, 232, 0.6)',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addEntryText: {
        marginTop: 8,
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(80, 149, 80, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    fab: {
        position: 'absolute',
        bottom: 20, // Adjusted for TabNavigator height usually, but HomeScreen is inside tab, so just above
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#36e236',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default HomeScreen;
