import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

/**
 * BreathingSuggestionCard — Apple-calm aesthetic
 *
 * Props:
 *   onStart   — () => void
 *   onDismiss — () => void
 */
const BreathingSuggestionCard = ({ onStart, onDismiss }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
            <View style={styles.accentBar} />
            <View style={styles.content}>
                <Text style={styles.title}>Take a Moment 🌿</Text>
                <Text style={styles.body}>
                    It looks like today has been a little heavy. A short breathing reset might help.
                </Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.startBtn}
                        onPress={onStart}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.startBtnText}>Start Breathing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.dismissBtn}
                        onPress={onDismiss}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.dismissBtnText}>Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 24,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 4,
    },
    accentBar: {
        width: 4,
        backgroundColor: '#34C759',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
    },
    body: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginTop: 7,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    startBtn: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#34C759',
        borderRadius: 999,
        alignItems: 'center',
    },
    startBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    dismissBtn: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#F3F4F6',
        borderRadius: 999,
        alignItems: 'center',
    },
    dismissBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
});

export default BreathingSuggestionCard;
