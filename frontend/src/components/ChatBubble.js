import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const ChatBubble = ({ role, content, isCrisis, resources }) => {
    const isUser = role === 'user';

    // Crisis Bubble Styling
    if (isCrisis) {
        return (
            <View style={[styles.bubble, styles.crisisBubble]}>
                <Text style={styles.crisisTitle}>Critical Support</Text>
                <Text style={styles.crisisText}>{content}</Text>
                {resources && resources.length > 0 && (
                    <View style={styles.resourceContainer}>
                        {resources.map((res, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.resourceButton}
                                onPress={() => Linking.openURL(res.url)}
                            >
                                <Text style={styles.resourceButtonText}>{res.name}: {res.contact}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.aiBubble
        ]}>
            <Text style={[
                styles.text,
                isUser ? styles.userText : styles.aiText
            ]}>
                {content}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginVertical: 4,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#36e236', // Primary Green
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#e8f3e8', // Sage
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#0e1b0e', // Dark Green/Black for contrast
    },
    aiText: {
        color: '#1a2e1a',
    },
    // Crisis Styles
    crisisBubble: {
        alignSelf: 'center',
        width: '90%',
        backgroundColor: '#fff5f5',
        borderColor: '#fc8181',
        borderWidth: 1,
        borderRadius: 12,
    },
    crisisTitle: {
        fontWeight: 'bold',
        color: '#c53030',
        marginBottom: 8,
        fontSize: 16,
    },
    crisisText: {
        color: '#2d3748',
        marginBottom: 12,
    },
    resourceContainer: {
        marginTop: 8,
        gap: 8,
    },
    resourceButton: {
        backgroundColor: '#c53030',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    resourceButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ChatBubble;
