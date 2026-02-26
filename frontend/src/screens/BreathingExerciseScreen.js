import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import ScreenBackground from '../components/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Exercise config — structured for easy extension with additional exercises later.
const EXERCISE = {
    name: '4-4-4 Breathing',
    phases: [
        { label: 'Inhale', duration: 4 },
        { label: 'Hold', duration: 4 },
        { label: 'Exhale', duration: 4 },
    ],
    cycles: 10, // 10 × 12s = 120s ≈ 2 minutes
};

const CYCLE_DURATION = EXERCISE.phases.reduce((sum, p) => sum + p.duration, 0); // 12s
const TOTAL_DURATION = EXERCISE.cycles * CYCLE_DURATION; // 120s

/** Derives current phase label from elapsed seconds (fractional). */
const getPhase = (elapsedSeconds) => {
    const cycleMs = CYCLE_DURATION * 1000;
    const positionInCycleMs = (elapsedSeconds * 1000) % cycleMs;
    let cumulativeMs = 0;
    for (const phase of EXERCISE.phases) {
        cumulativeMs += phase.duration * 1000;
        if (positionInCycleMs < cumulativeMs) return phase.label;
    }
    return EXERCISE.phases[0].label;
};

const BreathingExerciseScreen = () => {
    const navigation = useNavigation();

    // Keep the screen on for the duration of the session.
    useKeepAwake();

    const [elapsed, setElapsed] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(EXERCISE.phases[0].label);
    const [isComplete, setIsComplete] = useState(false);

    // Animated value for phase-label fade transition.
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Millisecond-precision wall-clock timer — eliminates rounding lag at phase boundaries.
    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsedMs = Date.now() - startTime;

            if (elapsedMs >= TOTAL_DURATION * 1000) {
                setElapsed(TOTAL_DURATION);
                setIsComplete(true);
                clearInterval(interval);
            } else {
                setElapsed(elapsedMs / 1000); // fractional seconds
            }
        }, 100); // poll 10× per second for precision

        return () => clearInterval(interval);
    }, []);

    // Fade-transition the phase label whenever the phase changes.
    useEffect(() => {
        const nextPhase = getPhase(elapsed);
        if (nextPhase !== currentPhase) {
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
            setCurrentPhase(nextPhase);
        }
    }, [elapsed]);

    const cycleNumber = Math.min(Math.floor(elapsed / CYCLE_DURATION) + 1, EXERCISE.cycles);
    const progressPercent = (elapsed / TOTAL_DURATION) * 100;
    return (
        <SafeAreaView style={styles.container}>
            <ScreenBackground variant="insights" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="chevron-left" size={28} color="#1a2e1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{EXERCISE.name}</Text>
                <View style={styles.backBtn} pointerEvents="none" />
            </View>

            {/* Progress bar — fills smoothly over 120 seconds */}
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>

            {/* Cycle counter */}
            {!isComplete && (
                <Text style={styles.cycleCounter}>
                    Cycle {cycleNumber} of {EXERCISE.cycles}
                </Text>
            )}

            {/* Lottie animation — fully synced to breathing cycle */}
            <View style={styles.animationContainer}>
                <LottieView
                    source={require('../../assets/lottie/breathing.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>

            {/* Phase instruction or completion message */}
            {isComplete ? (
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Well done 🌿</Text>
                    <Text style={styles.completionSubtitle}>
                        Notice how your body feels now.
                    </Text>
                    <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.phaseContainer}>
                    <Animated.Text style={[styles.phaseLabel, { opacity: fadeAnim }]}>
                        {currentPhase}
                    </Animated.Text>
                    <Text style={styles.phaseHint}>
                        {currentPhase === 'Inhale'
                            ? 'Breathe in slowly…'
                            : currentPhase === 'Hold'
                                ? 'Hold gently…'
                                : 'Release slowly…'}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a2e1a',
    },
    progressTrack: {
        height: 4,
        marginHorizontal: 24,
        backgroundColor: 'rgba(54,226,54,0.15)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#36e236',
        borderRadius: 2,
    },
    cycleCounter: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    animationContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: SCREEN_WIDTH * 0.72,
        height: SCREEN_WIDTH * 0.72,
    },
    phaseContainer: {
        alignItems: 'center',
        paddingBottom: 60,
        paddingHorizontal: 24,
    },
    phaseLabel: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1a2e1a',
        marginBottom: 8,
    },
    phaseHint: {
        fontSize: 15,
        color: '#64748b',
        fontStyle: 'italic',
    },
    completionContainer: {
        alignItems: 'center',
        paddingBottom: 60,
        paddingHorizontal: 32,
    },
    completionTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a2e1a',
        marginBottom: 10,
    },
    completionSubtitle: {
        fontSize: 15,
        color: '#64748b',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    doneBtn: {
        backgroundColor: '#36e236',
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 12,
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    doneBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0e1b0e',
    },
});

export default BreathingExerciseScreen;
