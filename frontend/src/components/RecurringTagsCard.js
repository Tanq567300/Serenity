import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecurringTagsCard = ({ tags }) => {
    // tags: array of { tag, frequency }

    // Take top 3
    const topTags = tags ? tags.slice(0, 3) : [];

    if (topTags.length === 0) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Recurring Themes</Text>
                <Text style={styles.emptyText}>No recurring themes detected yet.</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Recurring Themes</Text>
            <View style={styles.tagContainer}>
                {topTags.map((item, index) => (
                    <View key={index} style={styles.tagPill}>
                        <Text style={styles.tagName}>{item.tag || item}</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{item.frequency}x</Text>
                        </View>
                    </View>
                ))}
            </View>
            <Text style={styles.description}>
                Topics that appear frequently in your daily summaries.
            </Text>
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
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    tagPill: {
        backgroundColor: '#f0fdf4', // Very light green
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dcfce7',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagName: {
        color: '#166534', // Dark green text
        fontSize: 14,
        fontWeight: '500',
        marginRight: 8,
        textTransform: 'capitalize',
    },
    countBadge: {
        backgroundColor: '#166534',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    countText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
});

export default RecurringTagsCard;
