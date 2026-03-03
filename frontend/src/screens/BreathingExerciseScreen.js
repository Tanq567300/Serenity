import React, { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
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
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import ScreenBackground from '../components/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Breathing technique registry — add new techniques here; no engine logic changes needed.
const EXERCISES = {
    box444: {
        id: 'box444',
        name: '4-4-4 Breathing',
        phases: [
            { label: 'Inhale', duration: 4 },
            { label: 'Hold', duration: 4 },
            { label: 'Exhale', duration: 4 },
        ],
        cycles: 10, // 10 × 12s = 120s ≈ 2 minutes
        lottie: require('../../assets/lottie/breathing.json'),
        audio: require('../../assets/music/audio.mp3'),
    },
    fourSevenEight: {
        id: 'fourSevenEight',
        name: '4-7-8 Breathing',
        phases: [
            { label: 'Inhale', duration: 4 },
            { label: 'Hold', duration: 7 },
            { label: 'Exhale', duration: 8 },
        ],
        cycles: 5, // 5 × 19s = 95s ≈ 1.5 minutes
        lottie: require('../../assets/lottie/breathing_1.json'),
        audio: require('../../assets/music/audio_1.mp3'),
    },
    coherent55: {
        id: 'coherent55',
        name: '5-5 Breathing',
        phases: [
            { label: 'Inhale', duration: 5 },
            { label: 'Exhale', duration: 5 },
        ],
        cycles: 12, // 12 × 10s = 120s ≈ 2 minutes
        lottie: require('../../assets/lottie/breathing_2.json'),
        audio: require('../../assets/music/audio_2.mp3'),
    },
};

/**
 * Derives current phase label from elapsed seconds (fractional).
 * Exercise-agnostic — driven entirely by the phases array and cycleDuration.
 */
const getPhase = (elapsedSeconds, phases, cycleDuration) => {
    const cycleMs = cycleDuration * 1000;
    const positionInCycleMs = (elapsedSeconds * 1000) % cycleMs;
    let cumulativeMs = 0;
    for (const phase of phases) {
        cumulativeMs += phase.duration * 1000;
        if (positionInCycleMs < cumulativeMs) return phase.label;
    }
    return phases[0].label;
};

const BreathingExerciseScreen = ({ route }) => {
    const navigation = useNavigation();

    // Keep the screen on for the duration of the session.
    useKeepAwake();

    // Route-based exercise selection — defaults to 4-4-4 when no params are supplied.
    const exerciseId = route?.params?.exerciseId ?? 'box444';
    const selectedExercise = EXERCISES[exerciseId] ?? EXERCISES.box444;

    // Cycles through all techniques without growing the navigation stack.
    const exerciseOrder = ['box444', 'fourSevenEight', 'coherent55'];
    const handleSwitchExercise = () => {
        const currentIndex = exerciseOrder.indexOf(selectedExercise.id);
        const nextExercise = exerciseOrder[(currentIndex + 1) % exerciseOrder.length];
        navigation.replace('BreathingExercise', { exerciseId: nextExercise });
    };

    // Derive timing constants from the selected exercise so nothing is hardcoded.
    const cycleDuration = selectedExercise.phases.reduce((sum, p) => sum + p.duration, 0);
    const totalDuration = selectedExercise.cycles * cycleDuration;

    // Freeze exercise data in refs so interval/effect closures never read stale values.
    const cycleDurationRef = useRef(cycleDuration);
    const totalDurationRef = useRef(totalDuration);
    const phasesRef = useRef(selectedExercise.phases);

    // Audio state
    const soundRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    const [elapsed, setElapsed] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(selectedExercise.phases[0].label);
    const [isComplete, setIsComplete] = useState(false);

    // Animated value for phase-label fade transition.
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Audio lifecycle — loads ONCE on mount, unloads ONCE on unmount.
    // [] is correct: navigation.replace fully remounts on exercise switch.
    // DO NOT add any dependency here — any state dependency causes restart.
    useEffect(() => {
        let sound; // local reference so cleanup is always accurate

        const loadAndPlay = async () => {
            // Configure audio session (required on iOS for looping in silent mode).
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
            });

            const { sound: created } = await Audio.Sound.createAsync(
                selectedExercise.audio,
                { isLooping: true, volume: 1.0 }
            );

            sound = created;
            soundRef.current = sound;
            await sound.playAsync();
        };

        loadAndPlay();

        return () => {
            // Use local `sound` — soundRef.current may have been cleared already.
            if (sound) {
                sound.stopAsync().then(() => sound.unloadAsync());
            }
            soundRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Mute / unmute — volume only, never restarts audio.
    const handleToggleMute = async () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (soundRef.current) {
            await soundRef.current.setVolumeAsync(newMuted ? 0 : 1);
        }
    };


    // Millisecond-precision wall-clock timer — eliminates rounding lag at phase boundaries.
    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsedMs = Date.now() - startTime;

            if (elapsedMs >= totalDurationRef.current * 1000) {
                setElapsed(totalDurationRef.current);
                setIsComplete(true);
                clearInterval(interval);
            } else {
                setElapsed(elapsedMs / 1000); // fractional seconds
            }
        }, 100); // poll 10× per second for precision

        return () => clearInterval(interval);
    }, []);

    // Distinct haptic feedback per phase — fired only on an actual transition.
    // Hold haptic only fires when the current exercise actually has a Hold phase.
    const hapticForPhase = async (label) => {
        if (label === 'Inhale') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (label === 'Hold') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (label === 'Exhale') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    // Fade-transition the phase label and emit a haptic whenever the phase changes.
    useEffect(() => {
        const nextPhase = getPhase(elapsed, phasesRef.current, cycleDurationRef.current);
        if (nextPhase !== currentPhase) {
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
            hapticForPhase(nextPhase);
            setCurrentPhase(nextPhase);
        }
    }, [elapsed]);

    const cycleNumber = Math.min(Math.floor(elapsed / cycleDurationRef.current) + 1, selectedExercise.cycles);
    const progressPercent = (elapsed / totalDurationRef.current) * 100;
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
                <Text style={styles.headerTitle}>{selectedExercise.name}</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.muteBtn}
                        onPress={handleToggleMute}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name={isMuted ? 'volume-off' : 'volume-up'}
                            size={22}
                            color="#1a2e1a"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.switchBtn}
                        onPress={handleSwitchExercise}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="arrow-forward" size={22} color="#1a2e1a" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Progress bar — fills smoothly over 120 seconds */}
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>

            {/* Cycle counter */}
            {!isComplete && (
                <Text style={styles.cycleCounter}>
                    Cycle {cycleNumber} of {selectedExercise.cycles}
                </Text>
            )}

            {/* Lottie animation — fully synced to breathing cycle */}
            <View style={styles.animationContainer}>
                <LottieView
                    source={selectedExercise.lottie}
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
                                : 'Release gently…'}
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    muteBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    switchBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
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
