import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserPattern } from '../services/patternApi';
import { useNavigation } from '@react-navigation/native';
import BaselineMoodCard from '../components/BaselineMoodCard';
import MoodTrendCard from '../components/MoodTrendCard';
import DominantEmotionCard from '../components/DominantEmotionCard';
import RecurringTagsCard from '../components/RecurringTagsCard';

const PatternDashboardScreen = () => {
    const navigation = useNavigation();
    const [pattern, setPattern] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPattern = async () => {
            try {
                setLoading(true);
                const data = await getUserPattern();
                setPattern(data);
            } catch (err) {
                console.error('Failed to fetch pattern:', err);
                setError('Failed to load insights.');
            } finally {
                setLoading(false);
            }
        };

        fetchPattern();
    }, []);

    const handleBack = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#36e236" />
                    <Text style={styles.loadingText}>Analyzing patterns...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Insufficient Data State
    if (!pattern) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Insights</Text>
                    <View style={{ width: 60 }} /> {/* Spacer */}
                </View>
                <View style={styles.centerContainer}>
                    <Text style={styles.placeholderTitle}>Gathering Insights 🌱</Text>
                    <Text style={styles.placeholderText}>
                        We need a few more days of interaction to detect meaningful patterns in your mood and conversations. Check back soon!
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Insights</Text>
                <View style={{ width: 60 }} /> {/* Spacer */}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <BaselineMoodCard baseline={pattern.baselineMood} />
                <MoodTrendCard trend={pattern.moodTrendDirection} />
                <DominantEmotionCard emotion={pattern.dominantEmotionTrend} />
                <RecurringTagsCard tags={pattern.recurringTags} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8f6',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a2e1a',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#36e236',
        fontSize: 16,
        fontWeight: '500',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingText: {
        marginTop: 12,
        color: '#64748b',
        fontSize: 16,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
    },
    placeholderTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a2e1a',
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
    debugText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    }
});

export default PatternDashboardScreen;
