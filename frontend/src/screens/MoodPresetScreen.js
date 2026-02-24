import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoodPresetScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { sliderScore } = route.params;

    const [selectedMood, setSelectedMood] = useState(null);

    // Determine preset array
    let presets = [];
    if (sliderScore >= 8) {
        presets = ['Happy', 'Calm', 'Grateful', 'Motivated', 'Hopeful'];
    } else if (sliderScore >= 5) {
        presets = ['Okay', 'Reflective', 'Tired', 'Thoughtful'];
    } else {
        presets = ['Anxious', 'Sad', 'Overwhelmed', 'Irritated', 'Lonely'];
    }
    presets.push('Other');

    const handleContinue = () => {
        navigation.navigate('JournalEntry', {
            sliderScore,
            selectedMoodLabel: selectedMood
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenBackground variant="journal" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#475569" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.prompt}>What are you feeling right now?</Text>
                <Text style={styles.subtext}>Select a label that best matches your mood.</Text>

                <ScrollView contentContainerStyle={styles.pillsContainer} showsVerticalScrollIndicator={false}>
                    {presets.map((mood) => {
                        const isSelected = selectedMood === mood;
                        return (
                            <TouchableOpacity
                                key={mood}
                                style={[styles.pill, isSelected && styles.pillSelected]}
                                onPress={() => setSelectedMood(mood)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                                    {mood}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !selectedMood && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={!selectedMood}
                >
                    <Text style={[styles.continueText, !selectedMood && styles.disabledText]}>Continue</Text>
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
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    prompt: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 30,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 20,
    },
    pill: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    pillSelected: {
        backgroundColor: '#36e236',
        borderColor: '#36e236',
        shadowColor: '#36e236',
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    pillText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#475569',
    },
    pillTextSelected: {
        color: '#ffffff',
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
