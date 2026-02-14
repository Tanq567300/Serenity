import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';

const ChatBubble = ({ role, content, isCrisis, resources, timestamp }) => {
    const isUser = role === 'user';

    // Format timestamp (e.g. 10:30 AM)
    const timeString = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    if (isCrisis) {
        return (
            <View style={[styles.container, styles.crisisContainer]}>
                <Text style={[styles.text, styles.crisisText]}>{content}</Text>
                {resources && resources.map((res, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.resourceButton}
                        onPress={() => Linking.openURL('tel:988')} // Hardcoded for now based on typical crisis resource
                    >
                        <Text style={styles.resourceText}>{res.name}: {res.contact}</Text>
                    </TouchableOpacity>
                ))}
                <Text style={styles.timestamp}>{timeString}</Text>
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.aiContainer
        ]}>
            <Text style={[
                styles.text,
                isUser ? styles.userText : styles.aiText
            ]}>
                {content}
            </Text>
            <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                {timeString}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: spacing.m,
        borderRadius: 20,
        marginVertical: spacing.xs,
    },
    userContainer: {
        alignSelf: 'flex-end',
        backgroundColor: colors.userBubble,
        borderBottomRightRadius: 4,
    },
    aiContainer: {
        alignSelf: 'flex-start',
        backgroundColor: colors.aiBubble,
        borderBottomLeftRadius: 4,
    },
    crisisContainer: {
        alignSelf: 'center',
        backgroundColor: colors.crisis,
        width: '90%',
        borderColor: colors.error,
        borderWidth: 1,
    },
    text: {
        ...typography.body,
        fontSize: 16,
    },
    userText: {
        color: colors.userText,
    },
    aiText: {
        color: colors.aiText,
    },
    crisisText: {
        color: colors.crisisText,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: spacing.s
    },
    timestamp: {
        ...typography.caption,
        fontSize: 10,
        marginTop: spacing.xs,
        alignSelf: 'flex-end',
        opacity: 0.7
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    aiTimestamp: {
        color: colors.textSecondary,
    },
    resourceButton: {
        backgroundColor: colors.error,
        padding: spacing.s,
        borderRadius: 8,
        marginTop: spacing.s,
        alignItems: 'center'
    },
    resourceText: {
        color: '#FFF',
        fontWeight: 'bold'
    }
});

export default ChatBubble;
