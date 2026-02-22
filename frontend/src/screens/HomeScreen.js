import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useAuthStore from '../stores/authStore';
import { getDashboardData } from '../services/dashboardApi';
import ScreenBackground from '../components/ScreenBackground';
import ArticleCard from '../components/ArticleCard';
import { getPersonalizedArticles } from '../services/articlesApi';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [articles, setArticles] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch dashboard data — runs on every screen focus
    const fetchDashboard = async (isRefreshing = false) => {
        try {
            const data = await getDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
            if (isRefreshing) setRefreshing(false);
        }
    };

    // Fetch articles — only on first load or manual pull-to-refresh
    const fetchArticles = async () => {
        try {
            setArticlesLoading(true);
            const result = await getPersonalizedArticles();
            setArticles(result.articles || []);
        } catch (error) {
            console.error('Failed to load articles:', error);
        } finally {
            setArticlesLoading(false);
        }
    };

    // On focus: only refresh dashboard, not articles
    useFocusEffect(
        useCallback(() => {
            fetchDashboard();
        }, [])
    );

    // Load articles once on mount
    React.useEffect(() => {
        fetchArticles();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboard(true);
        fetchArticles(); // also refresh articles on manual pull
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#36e236" />
            </View>
        );
    }

    const userName = dashboardData?.userName || user?.name || 'Friend';
    const moodScore = dashboardData?.moodScore || 0;
    const quote = dashboardData?.quote || "Breathe. You're doing great.";
    const recentJournals = dashboardData?.recentJournals || [];
    const aiGuideMessage = dashboardData?.aiGuideMessage || `How are you feeling right now, ${userName}?`;

    // Mood ring calculations
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const progress = moodScore / 10;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <SafeAreaView style={styles.container}>
            <ScreenBackground variant="default" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#36e236']} />}
            >
                {/* Top Bar */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandText}>SERENITY</Text>
                        <Text style={styles.greetingText}>Good Morning, {userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFWDxMWy5qHcRG6uajml4aSDOHROvpkpuQxlscGWLee5MCYFoSHdSno2yBtF570LevKt-jwQjdiitiTO_INS18kwJ6z0bIHttf8AiHc4NFniaFHzpsEBelhr21JUomsi8m8Fm6n9z7v6-5j5A7uf5H73uUDtMfuJdouO_L1N_7It7ZS__A9vPedXEQIWUD7O09nNWUBbOSbJvA2YiSr-8rD-KvU1_XhaIUXdAqGnV0BAmwpYp8x3QMhMRQVDXv7DjnBXlbcSrNxW6b' }}
                                style={styles.profileImage}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Mood Score Section */}
                <View style={styles.moodSection}>
                    <View style={styles.moodRingContainer}>
                        <Svg height="250" width="250" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                            <Circle cx="50" cy="50" r={radius} stroke="#e8f3e8" strokeWidth="4" fill="none" />
                            <Circle
                                cx="50" cy="50" r={radius}
                                stroke="#36e236"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </Svg>
                        <View style={styles.moodTextContainer}>
                            <Text style={styles.moodScore}>{moodScore > 0 ? moodScore : '-'}</Text>
                            <Text style={styles.moodLabel}>MOOD SCORE</Text>
                        </View>
                        <View style={styles.glowEffect} />
                    </View>
                    <Text style={styles.quoteText}>"{quote}"</Text>
                </View>

                {/* AI Guide Section — tap anywhere to open chat */}
                <TouchableOpacity style={styles.aiGuideContainer} onPress={() => navigation.navigate('Chat')} activeOpacity={0.85}>
                    <View style={styles.aiGuideContent}>
                        <View style={styles.aiIconContainer}>
                            <MaterialIcons name="auto-awesome" size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.aiGuideTitle}>Always-On AI Guide  →</Text>
                            <Text style={styles.aiGuideQuestion}>{aiGuideMessage}</Text>
                        </View>
                    </View>
                    <View style={styles.quickActions}>
                        {moodScore < 4 ? (
                            <>
                                <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "I need support" })}>
                                    <Text style={styles.quickActionText}>I need support</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "Help me relax" })}>
                                    <Text style={styles.quickActionText}>Help me relax</Text>
                                </TouchableOpacity>
                            </>
                        ) : moodScore > 7 ? (
                            <>
                                <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "I'm feeling great today!" })}>
                                    <Text style={styles.quickActionText}>I'm great today!</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "What can I do to stay positive?" })}>
                                    <Text style={styles.quickActionText}>Stay positive</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "I'm feeling calm" })}>
                                    <Text style={styles.quickActionText}>I'm feeling calm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chat', { initialMessage: "A bit anxious" })}>
                                    <Text style={styles.quickActionText}>A bit anxious</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Mood Journal Section */}
                <View style={styles.journalSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Journal</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
                            <Text style={styles.viewAllText}>VIEW ALL</Text>
                        </TouchableOpacity>
                    </View>

                    {recentJournals.length > 0 ? (
                        recentJournals.map((journal) => (
                            <View key={journal.id} style={styles.journalCard}>
                                <View style={[styles.journalIconContainer, { backgroundColor: '#e8f3e8' }]}>
                                    <MaterialIcons name="article" size={24} color="#509550" />
                                </View>
                                <View style={styles.journalContent}>
                                    <View style={styles.journalHeader}>
                                        <Text style={styles.journalTitle}>
                                            {journal.dominantEmotion ? journal.dominantEmotion.charAt(0).toUpperCase() + journal.dominantEmotion.slice(1) : 'Daily Entry'}
                                        </Text>
                                        <Text style={styles.journalTime}>
                                            {new Date(journal.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <Text style={styles.journalPreview} numberOfLines={1}>
                                        {journal.summary}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No entries yet. Start chatting!</Text>
                    )}

                    {/* Add New Entry Prompt */}
                    <TouchableOpacity style={styles.addEntryCard} onPress={() => navigation.navigate('Journal')}>
                        <MaterialIcons name="edit" size={32} color="#509550" style={{ opacity: 0.6 }} />
                        <Text style={styles.addEntryText}>WRITE A JOURNAL ENTRY</Text>
                    </TouchableOpacity>
                </View>

                {/* Articles Section */}
                <View style={styles.articlesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Articles</Text>
                    </View>
                    {articlesLoading ? (
                        <ActivityIndicator size="small" color="#36e236" style={{ marginVertical: 24 }} />
                    ) : articles.length > 0 ? (
                        articles.map((item, idx) => (
                            <ArticleCard
                                key={item.id}
                                title={item.title}
                                description={item.description}
                                source={item.source}
                                index={idx}
                                onPress={() => navigation.navigate('ArticleDetail', { article: item })}
                            />
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Could not load articles. Check your connection.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent', // ScreenBackground handles the bg
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: '#94a3b8',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    articlesSection: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
});

export default HomeScreen;
