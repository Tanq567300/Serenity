import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CARD_IMAGES = [
    require('../../assets/articles/1.jpg'),
    require('../../assets/articles/2.jpg'),
    require('../../assets/articles/3.jpg'),
    require('../../assets/articles/4.jpg'),
    require('../../assets/articles/5.jpg'),
];

// Source → accent colour
const SOURCE_COLORS = {
    'NIMH': '#2d6a4f',
    'BMJ Mental Health': '#3d5a99',
    'The Guardian': '#6b3fa0',
};

const ArticleCard = ({ title, description, source, index = 0, onPress }) => {
    const accentColor = SOURCE_COLORS[source] || '#509550';
    const imageSource = CARD_IMAGES[index % CARD_IMAGES.length];

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />

            <View style={styles.content}>
                {/* Source badge */}
                {source ? (
                    <View style={[styles.sourceBadge, { backgroundColor: `${accentColor}18` }]}>
                        <Text style={[styles.sourceText, { color: accentColor }]}>{source.toUpperCase()}</Text>
                    </View>
                ) : null}

                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>

                <View style={styles.readMoreRow}>
                    <Text style={styles.readMoreText}>READ MORE</Text>
                    <Text style={styles.readMoreArrow}>→</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e8f3e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 170,
        backgroundColor: '#e8f3e8',
    },
    content: {
        padding: 16,
    },
    sourceBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 8,
    },
    sourceText: {
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0e1b0e',
        marginBottom: 6,
        lineHeight: 21,
    },
    description: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 19,
        marginBottom: 12,
    },
    readMoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    readMoreText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#36e236',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    readMoreArrow: {
        fontSize: 12,
        color: '#36e236',
        fontWeight: 'bold',
    },
});

export default ArticleCard;
