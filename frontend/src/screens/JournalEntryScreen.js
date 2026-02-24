import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

export default function JournalEntryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { sliderScore, selectedMoodLabel } = route.params;

    const [journalText, setJournalText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = async () => {
        if (!journalText.trim()) return;

        setIsLoading(true);
        setErrorMsg(null);

        try {
            const token = await SecureStore.getItemAsync('userToken');

            const response = await axios.post(`${API_URL}/mood/journal`, {
                sliderScore,
                selectedMoodLabel,
                journalText: journalText.trim()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Return to Home Screen directly
                navigation.navigate('Home');
            } else {
                setErrorMsg('Failed to save journal.');
            }
        } catch (error) {
            console.error('Submit journal error:', error);
            setErrorMsg('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenBackground variant="journal" />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={28} color="#475569" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.prompt}>Would you like to write about it?</Text>

                    {errorMsg && (
                        <View style={styles.errorBox}>
                            <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type your thoughts here..."
                            placeholderTextColor="#94a3b8"
                            multiline
                            autoFocus
                            textAlignVertical="top"
                            value={journalText}
                            onChangeText={setJournalText}
                            maxLength={1000}
                        />
                    </View>
                    <Text style={styles.charCount}>{journalText.length} / 1000</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.continueButton, (!journalText.trim() || isLoading) && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={!journalText.trim() || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={[styles.continueText, !journalText.trim() && styles.disabledText]}>Complete Journal</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f6faf6',
    },
    keyboardView: {
        flex: 1,
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
        paddingTop: 30,
    },
    prompt: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 20,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: '#334155',
        lineHeight: 28,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 8,
        fontWeight: '500',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#ef4444',
        marginLeft: 8,
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    continueButton: {
        backgroundColor: '#36e236',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    continueText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
        shadowColor: 'transparent',
    },
    disabledText: {
        color: '#64748b',
    }
});
