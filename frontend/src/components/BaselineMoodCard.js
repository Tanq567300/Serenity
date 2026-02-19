import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BaselineMoodCard = ({ baseline }) => {
    // baseline is a number 1-10
    const safeBaseline = baseline || 0;
    const percentage = (safeBaseline / 10) * 100;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Baseline Mood</Text>
            <View style={styles.content}>
                <Text style={styles.score}>{safeBaseline.toFixed(1)}<Text style={styles.scale}>/10</Text></Text>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.description}>
                    Your average emotional state based on recent conversations.
                </Text>
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
        alignItems: 'center',
    },
    score: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1a2e1a',
        marginBottom: 8,
    },
    scale: {
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '400',
    },
    progressBarBackground: {
        height: 8,
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#36e236',
        borderRadius: 4,
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
});

export default BaselineMoodCard;
