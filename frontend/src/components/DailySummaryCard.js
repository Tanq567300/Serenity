import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Emotion → icon + color mapping
const EMOTION_CONFIG = {
    happy: { icon: 'sentiment-very-satisfied', color: '#22c55e' },
    calm: { icon: 'spa', color: '#10b981' },
    anxious: { icon: 'sentiment-dissatisfied', color: '#f59e0b' },
    sad: { icon: 'sentiment-very-dissatisfied', color: '#6366f1' },
    angry: { icon: 'mood-bad', color: '#ef4444' },
    excited: { icon: 'sentiment-satisfied', color: '#ec4899' },
    grateful: { icon: 'favorite', color: '#36e236' },
    neutral: { icon: 'sentiment-neutral', color: '#94a3b8' },
};

const getMoodColor = (score) => {
    if (score >= 8) return '#22c55e';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
};

const DailySummaryCard = ({ memory, style, onStartBreathing }) => {
    // Empty state — small quiet placeholder
    if (!memory) {
        return (
            <View style={[styles.card, styles.emptyCard, style]}>
                <MaterialIcons name="auto-awesome" size={16} color="#36e236" />
                <Text style={styles.emptyText}>Your daily AI reflection will appear here</Text>
            </View>
        );
    }

    const { summary, dominantEmotion, averageMoodScore, tags, keyStressors, date } = memory;
    const positiveEmotions = ['happy', 'calm', 'neutral', 'grateful'];
    const shouldSuggestBreathing =
        averageMoodScore != null &&
        averageMoodScore <= 4 &&
        !positiveEmotions.includes((dominantEmotion || '').toLowerCase());
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric'
    });

    const emotion = (dominantEmotion || 'neutral').toLowerCase();
    const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;
    const moodColor = getMoodColor(averageMoodScore ?? 5);

    return (
        <View style={[styles.card, style]}>
            {/* Decorative icon watermark */}
            <View style={styles.watermark} pointerEvents="none">
                <MaterialIcons name="auto-awesome" size={64} color="#36e236" style={{ opacity: 0.08 }} />
            </View>

            {/* ── Top row: AI Insight label + date ── */}
            <View style={styles.topRow}>
                <View style={styles.labelRow}>
                    <MaterialIcons name="auto-awesome" size={14} color="#36e236" />
                    <Text style={styles.insightLabel}>AI Insight</Text>
                </View>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {/* ── Middle row: emotion pill + score + summary ── */}
            <View style={styles.midRow}>
                {/* Emotion icon bubble */}
                <View style={[styles.emotionBubble, { backgroundColor: config.color + '22' }]}>
                    <MaterialIcons name={config.icon} size={22} color={config.color} />
                </View>

                {/* Text content */}
                <View style={styles.textBlock}>
                    {/* Emotion + score on one line */}
                    <View style={styles.emotionRow}>
                        <Text style={[styles.emotionName, { color: config.color }]}>
                            {dominantEmotion ? dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1) : 'Neutral'}
                        </Text>
                        <View style={[styles.scorePill, { backgroundColor: moodColor + '22', borderColor: moodColor + '44' }]}>
                            <Text style={[styles.scoreText, { color: moodColor }]}>{averageMoodScore ?? '—'}/10</Text>
                        </View>
                    </View>

                    {/* Summary — max 2 lines */}
                    {summary ? (
                        <Text style={styles.summary} numberOfLines={2} ellipsizeMode="tail">
                            {summary}
                        </Text>
                    ) : null}
                </View>
            </View>

            {/* ── Bottom row: tags + stressors ── */}
            {((tags && tags.length > 0) || (keyStressors && keyStressors.length > 0)) && (
                <View style={styles.bottomRow}>
                    {tags && tags.slice(0, 3).map((tag, i) => (
                        <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                    {keyStressors && keyStressors.length > 0 && (
                        <Text style={styles.stressorText} numberOfLines={1}>
                            · {keyStressors.slice(0, 2).join(', ')}
                        </Text>
                    )}
                </View>
            )}

            {/* ── Breathing suggestion — only when mood is low ── */}
            {shouldSuggestBreathing && onStartBreathing && (
                <View style={styles.breathingSuggestion}>
                    <Text style={styles.breathingSuggestionText}>
                        Try a short breathing reset.
                    </Text>
                    <TouchableOpacity
                        style={styles.breathingSuggestionButton}
                        onPress={onStartBreathing}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.breathingSuggestionButtonText}>Start Breathing</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(54, 226, 54, 0.07)',
        borderWidth: 1,
        borderColor: 'rgba(54, 226, 54, 0.18)',
        borderRadius: 18,
        padding: 14,
        overflow: 'hidden',
        position: 'relative',
    },
    emptyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    emptyText: {
        fontSize: 13,
        color: '#64748b',
        fontStyle: 'italic',
    },
    watermark: {
        position: 'absolute',
        right: -8,
        top: -8,
    },

    // Top row
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    insightLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1a7a1a',
        letterSpacing: 0.3,
    },
    dateText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Mid row
    midRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    emotionBubble: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textBlock: {
        flex: 1,
        gap: 4,
    },
    emotionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emotionName: {
        fontSize: 14,
        fontWeight: '700',
    },
    scorePill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 99,
        borderWidth: 1,
    },
    scoreText: {
        fontSize: 11,
        fontWeight: '700',
    },
    summary: {
        fontSize: 13,
        lineHeight: 19,
        color: '#374151',
    },

    // Bottom row — tags + stressors inline
    bottomRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(54, 226, 54, 0.12)',
    },
    tag: {
        backgroundColor: 'rgba(54, 226, 54, 0.12)',
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 99,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#166534',
    },
    stressorText: {
        fontSize: 11,
        color: '#94a3b8',
        flexShrink: 1,
    },

    // Breathing suggestion
    breathingSuggestion: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    breathingSuggestionText: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 8,
    },
    breathingSuggestionButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#36e236',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    breathingSuggestionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0e1b0e',
    },
});

export default DailySummaryCard;
