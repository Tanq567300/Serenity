import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserPattern } from '../services/patternApi';
import { getDailyMemory } from '../services/memoryApi';
import BaselineMoodCard from '../components/BaselineMoodCard';
import MoodTrendCard from '../components/MoodTrendCard';
import DominantEmotionCard from '../components/DominantEmotionCard';
import RecurringTagsCard from '../components/RecurringTagsCard';
import DailySummaryCard from '../components/DailySummaryCard';
import ScreenBackground from '../components/ScreenBackground';
import { useNavigation } from '@react-navigation/native';

const PatternDashboardScreen = () => {
    const navigation = useNavigation();
    const [pattern, setPattern] = useState(null);
    const [patternLoading, setPatternLoading] = useState(true);
    const [dailyMemory, setDailyMemory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchPattern();
        fetchDailyMemory(new Date());
    }, []);

    const fetchPattern = async () => {
        try {
            setPatternLoading(true);
            const data = await getUserPattern();
            setPattern(data);
        } catch (err) {
            console.error('Failed to fetch pattern:', err);
        } finally {
            setPatternLoading(false);
        }
    };

    const fetchDailyMemory = async (date) => {
        try {
            const memory = await getDailyMemory(date);
            setDailyMemory(memory);
        } catch (err) {
            setDailyMemory(null);
        }
    };

    const handleDateChange = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
        fetchDailyMemory(newDate);
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();

    const formatDate = (date) => {
        if (date.toDateString() === new Date().toDateString()) return 'Today';
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenBackground variant="insights" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Insights</Text>
                <TouchableOpacity onPress={fetchPattern} style={styles.refreshBtn}>
                    <MaterialIcons name="refresh" size={20} color="#36e236" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ── Daily Summary ── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>DAILY SUMMARY</Text>
                    <View style={styles.dateNav}>
                        <TouchableOpacity onPress={() => handleDateChange(-1)} style={styles.navBtn}>
                            <MaterialIcons name="chevron-left" size={20} color="#36e236" />
                        </TouchableOpacity>
                        <Text style={styles.dateLabel}>{formatDate(selectedDate)}</Text>
                        <TouchableOpacity
                            onPress={() => handleDateChange(1)}
                            style={[styles.navBtn, isToday && styles.navBtnDisabled]}
                            disabled={isToday}
                        >
                            <MaterialIcons name="chevron-right" size={20} color={isToday ? '#e2e8f0' : '#36e236'} />
                        </TouchableOpacity>
                    </View>
                </View>

                <DailySummaryCard
                    memory={dailyMemory}
                    onStartBreathing={() => navigation.navigate('BreathingExercise')}
                />

                {!dailyMemory && (
                    <View style={styles.noDataCard}>
                        <Text style={styles.noDataEmoji}>📓</Text>
                        <Text style={styles.noDataTitle}>No entry for this day</Text>
                        <Text style={styles.noDataText}>Write a journal entry to see your daily summary here</Text>
                    </View>
                )}

                {/* ── Mood Patterns ── */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={styles.sectionTitle}>YOUR PATTERNS</Text>
                </View>

                {patternLoading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color="#36e236" />
                        <Text style={styles.loadingText}>Analysing your patterns...</Text>
                    </View>
                ) : pattern ? (
                    <>
                        <BaselineMoodCard baseline={pattern.baselineMood} />
                        <MoodTrendCard trend={pattern.moodTrendDirection} />
                        <DominantEmotionCard emotion={pattern.dominantEmotionTrend} />
                        <RecurringTagsCard tags={pattern.recurringTags} />
                    </>
                ) : (
                    <View style={styles.patternPlaceholder}>
                        <MaterialIcons name="insights" size={40} color="rgba(54,226,54,0.4)" />
                        <Text style={styles.placeholderTitle}>Building Your Patterns 🌱</Text>
                        <Text style={styles.placeholderText}>
                            Write journal entries for a few days and Mansik will surface personalised mood trends, emotional patterns, and recurring themes.
                        </Text>
                        <View style={styles.milestoneRow}>
                            {[1, 3, 7, 14, 30].map(n => (
                                <View key={n} style={styles.milestone}>
                                    <Text style={styles.milestoneNum}>{n}</Text>
                                    <Text style={styles.milestoneLabel}>day{n > 1 ? 's' : ''}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.milestoneHint}>Unlock deeper insights as you journal more</Text>
                    </View>
                )}

                {/* ── Guided Breathing Exercise ── */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={styles.sectionTitle}>MINDFUL RESET</Text>
                </View>

                <View style={styles.breathingCard}>
                    <View style={styles.breathingIconBadge}>
                        <MaterialIcons name="air" size={24} color="#fff" />
                    </View>
                    <Text style={styles.breathingTitle}>Guided Breathing Exercise</Text>
                    <Text style={styles.breathingSubtitle}>
                        Take a moment your way. Try a different breathing style whenever you need.
                    </Text>
                    <TouchableOpacity
                        style={styles.breathingBtn}
                        onPress={() => navigation.navigate('BreathingExercise')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.breathingBtnText}>Start Breathing</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a2e1a' },
    refreshBtn: { padding: 6, borderRadius: 16, backgroundColor: 'rgba(54,226,54,0.1)' },
    scrollContent: { padding: 16, paddingBottom: 120 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1.2 },
    dateNav: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    navBtn: { padding: 4, borderRadius: 12, backgroundColor: 'rgba(54,226,54,0.1)' },
    navBtnDisabled: { backgroundColor: '#f1f5f9' },
    dateLabel: { fontSize: 14, fontWeight: '600', color: '#334155', minWidth: 80, textAlign: 'center' },
    noDataCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center',
        borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 8,
    },
    noDataEmoji: { fontSize: 36, marginBottom: 10 },
    noDataTitle: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 4 },
    noDataText: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },
    loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 20, justifyContent: 'center' },
    loadingText: { color: '#64748b', fontSize: 14 },
    patternPlaceholder: {
        backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center',
        borderWidth: 1, borderColor: '#f1f5f9',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
    },
    placeholderTitle: { fontSize: 18, fontWeight: '600', color: '#1a2e1a', marginTop: 14, marginBottom: 8 },
    placeholderText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    milestoneRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    milestone: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(54,226,54,0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    milestoneNum: { fontSize: 13, fontWeight: 'bold', color: '#36e236' },
    milestoneLabel: { fontSize: 8, color: '#94a3b8' },
    milestoneHint: { fontSize: 11, color: '#94a3b8' },
    breathingCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    breathingIconBadge: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#36e236',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    breathingTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1a2e1a',
        marginBottom: 6,
        textAlign: 'center',
    },
    breathingSubtitle: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    breathingBtn: {
        backgroundColor: '#36e236',
        paddingVertical: 13,
        paddingHorizontal: 36,
        borderRadius: 12,
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    breathingBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0e1b0e',
    },
});

export default PatternDashboardScreen;
