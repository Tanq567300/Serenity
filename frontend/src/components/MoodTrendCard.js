import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoodTrendCard = ({ trend }) => {
    // trend: 'upward', 'downward', 'stable', or null

    const getTrendDetails = (trend) => {
        switch (trend) {
            case 'upward':
                return {
                    label: 'Improving',
                    icon: '↗',
                    color: '#36e236', // Green
                    description: 'Your mood has been trending positively over the last week.'
                };
            case 'downward':
                return {
                    label: 'Declining',
                    icon: '↘',
                    color: '#f59e0b', // Amber/Orange suitable for caution, not alarmist red
                    description: 'You seem a bit more stressed lately. Take some time for yourself.'
                };
            case 'stable':
            default:
                return {
                    label: 'Stable',
                    icon: '→',
                    color: '#3b82f6', // Blue
                    description: 'Your mood has been consistent with no major fluctuations.'
                };
        }
    };

    const details = getTrendDetails(trend);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Mood Trend</Text>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: `${details.color}20` }]}>
                    <Text style={[styles.icon, { color: details.color }]}>{details.icon}</Text>
                </View>
                <Text style={styles.label}>{details.label}</Text>
                <Text style={styles.description}>{details.description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2e1a',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
});

export default MoodTrendCard;
