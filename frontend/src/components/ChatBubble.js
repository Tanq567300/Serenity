import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const ChatBubble = ({ role, content, isCrisis, resources }) => {
    const isUser = role === 'user';

    // Crisis bubble — warm, human, non-robotic
    if (isCrisis) {
        return (
            <View style={styles.crisisWrapper}>
                <View style={styles.crisisBubble}>
                    {/* Soft header */}
                    <View style={styles.crisisHeader}>
                        <Text style={styles.crisisIcon}>💙</Text>
                        <Text style={styles.crisisTitle}>You're not alone in this</Text>
                    </View>

                    {/* The warm message text */}
                    <Text style={styles.crisisText}>{content}</Text>

                    {/* Resource buttons */}
                    {resources && resources.length > 0 && (
                        <View style={styles.resourceContainer}>
                            <Text style={styles.resourceLabel}>Reach out — someone is ready to listen:</Text>
                            {resources.map((res, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.resourceButton}
                                    onPress={() => res.url ? Linking.openURL(res.url) : null}
                                >
                                    <Text style={styles.resourceName}>{res.name}</Text>
                                    <Text style={styles.resourceContact}>{res.contact}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        );
    }

    if (isUser) {
        return (
            <View style={styles.userRow}>
                <View style={styles.userMeta}>
                    <Text style={styles.youLabel}>YOU</Text>
                </View>
                <View style={styles.userBubble}>
                    <Text style={styles.userText}>{content}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.aiRow}>
            <View style={styles.aiMeta}>
                <Text style={styles.mansikLabel}>MANSIK</Text>
            </View>
            <View style={styles.aiBubble}>
                <Text style={styles.aiText}>{content}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // AI bubble
    aiRow: {
        maxWidth: '85%',
        alignSelf: 'flex-start',
        marginVertical: 4,
    },
    aiMeta: {
        marginLeft: 16,
        marginBottom: 4,
    },
    mansikLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.6,
        color: '#36e236',
    },
    aiBubble: {
        backgroundColor: 'rgba(232, 243, 232, 0.72)',
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.45)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    aiText: {
        fontSize: 15,
        lineHeight: 24,
        color: 'rgba(14, 27, 14, 0.9)',
        fontWeight: '500',
    },

    // User bubble
    userRow: {
        maxWidth: '85%',
        alignSelf: 'flex-end',
        marginVertical: 4,
        alignItems: 'flex-end',
    },
    userMeta: {
        marginRight: 16,
        marginBottom: 4,
    },
    youLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.6,
        color: '#94a3b8',
    },
    userBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        borderRadius: 16,
        borderBottomRightRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.65)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    userText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#1a1a1a',
    },

    // Crisis — warm, gentle, soft indigo tones
    crisisWrapper: {
        alignSelf: 'center',
        width: '92%',
        marginVertical: 12,
    },
    crisisBubble: {
        backgroundColor: '#f0f4ff',
        borderColor: '#c7d2fe',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    crisisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    crisisIcon: {
        fontSize: 22,
    },
    crisisTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3730a3',
        flexShrink: 1,
    },
    crisisText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#374151',
        marginBottom: 16,
    },
    resourceContainer: {
        gap: 10,
    },
    resourceLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366f1',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    resourceButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#c7d2fe',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resourceName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3730a3',
        flexShrink: 1,
    },
    resourceContact: {
        fontSize: 13,
        color: '#6366f1',
        fontWeight: '500',
        marginLeft: 8,
    },
});

export default ChatBubble;

