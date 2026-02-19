import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../stores/authStore';
import useChatStore from '../stores/chatStore';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import DailySummaryCard from '../components/DailySummaryCard';
import { getDailyMemory } from '../services/memoryApi';

const ChatScreen = () => {
    // Store hooks
    const {
        messages,
        isTyping,
        isCrisis,
        initializeSession,
        sendMessage,
        error
    } = useChatStore();
    const { logout } = useAuthStore();
    const [inputText, setInputText] = useState('');
    const [dailyMemory, setDailyMemory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const flatListRef = useRef(null);

    useEffect(() => {
        initializeSession();
        fetchDailyMemory(selectedDate);
    }, []);

    const fetchDailyMemory = async (date) => {
        try {
            const memory = await getDailyMemory(date);
            setDailyMemory(memory);
        } catch (err) {
            console.log('Failed to fetch memory', err);
            if (err.response && err.response.status === 401) {
                // Token expired or invalid
                // Ideally trigger logout here
            }
            setDailyMemory(null);
        }
    };

    const handleDateChange = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
        fetchDailyMemory(newDate);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText('');
        await sendMessage(text);
    };

    const renderItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            content={item.content}
            isCrisis={item.isCrisis}
            resources={item.resources}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Serenity AI</Text>
                <View style={styles.statusDot} />
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
                <TouchableOpacity onPress={() => handleDateChange(-1)} style={styles.navButton}>
                    <Text style={styles.navArrow}>{'<'}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <DailySummaryCard memory={dailyMemory} />
                </View>
                <TouchableOpacity onPress={() => handleDateChange(1)} style={styles.navButton}>
                    <Text style={styles.navArrow}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={
                    <>
                        {isTyping && <TypingIndicator />}
                        {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text>}
                    </>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#9ca3af"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.disabledSend]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isTyping}
                    >
                        <Text style={styles.sendButtonText}>→</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8f6',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a2e1a',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#36e236',
        marginLeft: 8,
    },
    logoutButton: {
        position: 'absolute',
        right: 16,
        padding: 8,
    },
    logoutText: {
        color: '#64748b',
        fontSize: 12,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#f6f8f6',
        zIndex: 1,
    },
    navButton: {
        padding: 10,
        justifyContent: 'center',
    },
    navArrow: {
        fontSize: 24,
        color: '#94a3b8',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
        color: '#1a2e1a',
    },
    sendButton: {
        marginLeft: 12,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#36e236',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledSend: {
        backgroundColor: '#e2e8f0',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
