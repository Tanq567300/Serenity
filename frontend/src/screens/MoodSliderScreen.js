import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 80;
const KNOB_SIZE = 36;

export default function MoodSliderScreen() {
    const navigation = useNavigation();
    const [score, setScore] = useState(5);
    const [hasInteracted, setHasInteracted] = useState(false);

    const pan = useRef(new Animated.Value((4 / 9) * SLIDER_WIDTH)).current; // Default at 5 (index 4 out of 9)

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setHasInteracted(true);
            },
            onPanResponderMove: (_, gestureState) => {
                let newX = gestureState.moveX - 40 - (KNOB_SIZE / 2); // 40 is paddingLeft
                if (newX < 0) newX = 0;
                if (newX > SLIDER_WIDTH) newX = SLIDER_WIDTH;

                pan.setValue(newX);

                const fraction = newX / SLIDER_WIDTH;
                const calculatedScore = Math.round(fraction * 9) + 1;
                setScore(calculatedScore);
            },
            onPanResponderRelease: (_, gestureState) => {
                let newX = gestureState.moveX - 40 - (KNOB_SIZE / 2);
                if (newX < 0) newX = 0;
                if (newX > SLIDER_WIDTH) newX = SLIDER_WIDTH;

                const fraction = newX / SLIDER_WIDTH;
                const calculatedScore = Math.round(fraction * 9) + 1;

                // Snap to nearest integer
                const snappedX = ((calculatedScore - 1) / 9) * SLIDER_WIDTH;
                Animated.spring(pan, {
                    toValue: snappedX,
                    useNativeDriver: false,
                    bounciness: 4
                }).start();

                setScore(calculatedScore);
            }
        })
    ).current;

    // Determine Emoji and Label
    let emoji = '😐';
    let label = 'Neutral';

    if (score <= 2) { emoji = '😢'; label = 'Very Low'; }
    else if (score <= 4) { emoji = '🙁'; label = 'Low'; }
    else if (score <= 6) { emoji = '😐'; label = 'Neutral'; }
    else if (score <= 8) { emoji = '🙂'; label = 'Good'; }
    else { emoji = '🤩'; label = 'Very Good'; }

    const handleContinue = () => {
        navigation.navigate('MoodPreset', { sliderScore: score });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenBackground variant="journal" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <MaterialIcons name="close" size={28} color="#475569" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.Text style={styles.emoji}>{emoji}</Animated.Text>

                <Text style={styles.prompt}>How is your mood right now?</Text>
                <Text style={styles.moodLabel}>{label}</Text>

                <View style={styles.sliderContainer}>
                    <View style={styles.trackBackground} />
                    <Animated.View style={[styles.trackFill, { width: pan }]} />

                    <Animated.View
                        style={[styles.knob, { left: pan }]}
                        {...panResponder.panHandlers}
                    >
                        <View style={styles.knobInner} />
                    </Animated.View>
                </View>

                <View style={styles.scaleLabels}>
                    <Text style={styles.scaleText}>1</Text>
                    <Text style={styles.scaleText}>10</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !hasInteracted && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={!hasInteracted}
                >
                    <Text style={[styles.continueText, !hasInteracted && styles.disabledText]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f6faf6',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-start',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    prompt: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 10,
    },
    moodLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 60,
    },
    sliderContainer: {
        width: SLIDER_WIDTH,
        height: 40,
        justifyContent: 'center',
        position: 'relative',
    },
    trackBackground: {
        position: 'absolute',
        left: KNOB_SIZE / 2,
        right: KNOB_SIZE / 2,
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
    },
    trackFill: {
        position: 'absolute',
        left: KNOB_SIZE / 2,
        height: 8,
        backgroundColor: '#36e236',
        borderRadius: 4,
    },
    knob: {
        position: 'absolute',
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    knobInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#36e236',
    },
    scaleLabels: {
        width: SLIDER_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: KNOB_SIZE / 2,
    },
    scaleText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    continueButton: {
        backgroundColor: '#1e293b',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    continueText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
    },
    disabledText: {
        color: '#64748b',
    }
});
