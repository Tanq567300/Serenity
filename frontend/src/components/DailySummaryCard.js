import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DailySummaryCard = ({ memory }) => {
    if (!memory) {
        return (
            <View style={styles.card}>
                <Text style={styles.emptyText}>Your daily reflection will appear here after your interactions.</Text>
            </View>
        );
    }

    const { summary, dominantEmotion, averageMoodScore, tags, keyStressors, date } = memory;
    const formattedDate = new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.date}>{formattedDate}</Text>
                <View style={[styles.moodBadge, { backgroundColor: getMoodColor(averageMoodScore) }]}>
                    <Text style={styles.moodText}>{dominantEmotion}</Text>
                </View>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Mood Score</Text>
                <View style={styles.scoreBarBackground}>
                    <View style={[styles.scoreBarFill, { width: `${(averageMoodScore / 10) * 100}%`, backgroundColor: getMoodColor(averageMoodScore) }]} />
                </View>
            </View>

            <Text style={styles.summary}>{summary}</Text>

            {tags && tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            {keyStressors && keyStressors.length > 0 && (
                <View style={styles.stressorsContainer}>
                    <Text style={styles.stressorLabel}>Stressors:</Text>
                    <Text style={styles.stressorText}>{keyStressors.join(', ')}</Text>
                </View>
            )}
        </View>
    );
};

// Helper for soft mood colors
const getMoodColor = (score) => {
    if (score >= 8) return '#86efac'; // Green-300
    if (score >= 5) return '#fde047'; // Yellow-300
    return '#fda4af'; // Rose-300
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism-ish
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    card: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 24,
        marginBottom: 16,
        height: 120,
    },
    emptyText: {
        color: '#64748b',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    date: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    moodBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moodText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a2e1a', // Dark text for contrast
        textTransform: 'capitalize',
    },
    scoreContainer: {
        marginBottom: 16,
    },
    scoreLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 6,
    },
    scoreBarBackground: {
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    summary: {
        fontSize: 16,
        lineHeight: 24,
        color: '#334155',
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#475569',
    },
    stressorsContainer: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    stressorLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 4,
    },
    stressorText: {
        fontSize: 14,
        color: '#64748b',
    }
});

export default DailySummaryCard;
