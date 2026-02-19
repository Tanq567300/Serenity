import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DominantEmotionCard = ({ emotion }) => {
    // emotion: string (e.g., 'Anxious', 'Happy')

    const getEmotionDetails = (emo) => {
        if (!emo) return { label: 'Neutral', emoji: '😐', color: '#9ca3af' };

        const lower = emo.toLowerCase();
        if (lower.includes('happy') || lower.includes('joy')) return { label: 'Happy', emoji: '😊', color: '#36e236' };
        if (lower.includes('anxious') || lower.includes('worried')) return { label: 'Anxious', emoji: '😰', color: '#f59e0b' };
        if (lower.includes('sad') || lower.includes('depress')) return { label: 'Sad', emoji: '😢', color: '#3b82f6' };
        if (lower.includes('angry')) return { label: 'Angry', emoji: '😠', color: '#ef4444' };
        if (lower.includes('calm')) return { label: 'Calm', emoji: '😌', color: '#10b981' };

        return { label: emo, emoji: '🤔', color: '#6366f1' };
    };

    const details = getEmotionDetails(emotion);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Most Frequent Emotion</Text>
            <View style={styles.content}>
                <Text style={styles.emoji}>{details.emoji}</Text>
                <Text style={[styles.label, { color: details.color }]}>{details.label}</Text>
                <Text style={styles.description}>
                    This emotion has come up most often in your recent reflections.
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
    emoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    label: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
});

export default DominantEmotionCard;
