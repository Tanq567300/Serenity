import React, { useEffect, useRef, useState } from 'react';
import {
    View, FlatList, StyleSheet, KeyboardAvoidingView, Platform,
    Text, TextInput, TouchableOpacity, ScrollView, Animated, Modal,
    TouchableWithoutFeedback, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import useChatStore from '../stores/chatStore';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';

// Simulates CSS filter:blur(60px) using layered semi-transparent circles
// Works on both iOS and Android — no native modules needed.
const GlowOrb = ({ color, size, style }) => {
    const layers = [
        { scale: 2.2, opacity: 0.04 },
        { scale: 1.8, opacity: 0.07 },
        { scale: 1.45, opacity: 0.11 },
        { scale: 1.15, opacity: 0.18 },
        { scale: 0.8, opacity: 0.26 },
    ];
    return (
        <View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
            {layers.map((l, i) => (
                <View key={i} style={{
                    position: 'absolute',
                    width: size * l.scale,
                    height: size * l.scale,
                    borderRadius: size * l.scale,
                    backgroundColor: color,
                    opacity: l.opacity,
                }} />
            ))}
        </View>
    );
};

// Context-aware smart suggestions based on the last AI message
const getSmartSuggestions = (messages) => {
    if (!messages || messages.length === 0) {
        return ["I'm feeling anxious", "I need to vent", "Help me breathe"];
    }
    const lastAI = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAI) return ["I'm feeling anxious", "I need to vent", "Help me breathe"];

    const text = (lastAI.content || '').toLowerCase();

    if (text.includes('breath') || text.includes('grounding') || text.includes('exercise')) {
        return ["Yes, let's try breathing", "I'd rather vent", "What is grounding?"];
    }
    if (text.includes('anxious') || text.includes('anxiety') || text.includes('panic')) {
        return ["Tell me more techniques", "I feel overwhelmed", "Help me relax"];
    }
    if (text.includes('sad') || text.includes('grief') || text.includes('loss')) {
        return ["I want to talk about it", "Give me a distraction", "I need support"];
    }
    if (text.includes('sleep') || text.includes('tired') || text.includes('rest')) {
        return ["Help me sleep better", "I'm exhausted", "Relaxation tips"];
    }
    if (text.includes('work') || text.includes('stress') || text.includes('overwhelm')) {
        return ["Work is too much", "Help me prioritize", "I need to relax"];
    }
    if (text.includes('gratitude') || text.includes('positive') || text.includes('great')) {
        return ["I'm feeling grateful", "Share more positivity", "I want to journal this"];
    }
    // Default fallback suggestions
    return ["I'm feeling anxious", "I need to vent", "Tell me a breathing exercise"];
};

const ChatScreen = ({ navigation, route }) => {
    const initialMessage = route?.params?.initialMessage || null;

    const { messages, isTyping, isCrisis, initializeSession, sendMessage, clearChat, error } = useChatStore();

    const [inputText, setInputText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const flatListRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Breathing/pulse animation for the avatar
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1.0, duration: 1200, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    // Init session
    useEffect(() => {
        const init = async () => {
            await initializeSession();
            if (initialMessage) {
                await sendMessage(initialMessage);
            }
        };
        init();
    }, []);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText('');
        await sendMessage(text);
    };

    const handleSuggestion = async (text) => {
        await sendMessage(text);
    };

    const handleClearChat = () => {
        setMenuVisible(false);
        Alert.alert(
            'Clear Chat',
            'Start a fresh conversation? Your current chat will be cleared.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => clearChat() },
            ]
        );
    };

    const suggestions = getSmartSuggestions(messages);

    const renderItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            content={item.content}
            isCrisis={item.isCrisis}
            resources={item.resources}
        />
    );

    return (
        <View style={styles.root}>
            {/* Ambient background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f0fdf4' }]} />

            {/* Soft-blur orbs */}
            <GlowOrb color="#36e236" size={300} style={{ top: -120, left: -100 }} />
            <GlowOrb color="#a78bfa" size={280} style={{ bottom: -60, right: -80 }} />
            <GlowOrb color="#5eead4" size={240} style={{ top: '38%', left: '15%' }} />

            {/* BlurView on top of the orbs — blurs them into a soft atmospheric haze */}
            <BlurView
                intensity={55}
                tint="light"
                experimentalBlurMethod="dimezisBlurView"
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color="#0e1b0e" />
                    </TouchableOpacity>

                    {/* Center: Avatar + listening text */}
                    <View style={styles.headerCenter}>
                        <View style={styles.avatarWrapper}>
                            {/* Pulse ring */}
                            <Animated.View style={[styles.avatarPulse, { transform: [{ scale: pulseAnim }] }]} />
                            {/* Avatar */}
                            <View style={styles.avatar}>
                                <MaterialIcons name="spa" size={22} color="#fff" />
                            </View>
                        </View>
                        <View style={styles.listeningRow}>
                            <View style={styles.listeningDot} />
                            <Text style={styles.listeningText}>Serenity AI is listening...</Text>
                        </View>
                    </View>

                    {/* More options */}
                    <TouchableOpacity style={styles.headerBtn} onPress={() => setMenuVisible(true)}>
                        <MaterialIcons name="more-horiz" size={22} color="#0e1b0e" />
                    </TouchableOpacity>
                </View>

                {/* ── Dropdown Menu Modal ── */}
                <Modal
                    visible={menuVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                        <View style={styles.menuOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleClearChat}>
                            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                            <Text style={styles.menuItemTextDanger}>Clear Chat</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* ── Messages ── */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListFooterComponent={
                        <>
                            {isTyping && <TypingIndicator />}
                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </>
                    }
                />

                {/* ── Footer ── */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    <View style={styles.footer}>
                        {/* Smart suggestions */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.suggestionsRow}
                        >
                            {suggestions.map((suggestion, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.chip}
                                    onPress={() => handleSuggestion(suggestion)}
                                    disabled={isTyping}
                                >
                                    <Text style={styles.chipText}>{suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Input bar */}
                        <View style={styles.inputBar}>
                            <TouchableOpacity style={styles.inputIconBtn}>
                                <MaterialIcons name="add" size={22} color="#9ca3af" />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.input}
                                placeholder="Tell me what's on your mind..."
                                placeholderTextColor="#9ca3af"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                onSubmitEditing={handleSend}
                            />

                            <View style={styles.inputRightGroup}>
                                <TouchableOpacity style={styles.inputIconBtn}>
                                    <MaterialIcons name="mic" size={22} color="#36e236" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDimmed]}
                                    onPress={handleSend}
                                    disabled={!inputText.trim() || isTyping}
                                >
                                    <MaterialIcons name="send" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f0fdf4',
    },
    safeArea: {
        flex: 1,
    },

    // ── Orbs ──
    orbBlur: {
        position: 'absolute',
        borderRadius: 9999,
        overflow: 'hidden',
    },
    orb: {
        borderRadius: 9999,
    },
    orbTopLeft: {
        width: 400,
        height: 400,
        backgroundColor: 'rgba(54, 226, 54, 0.22)',
    },
    orbBottomRight: {
        width: 340,
        height: 340,
        backgroundColor: 'rgba(167, 139, 250, 0.28)',
    },
    orbMid: {
        width: 300,
        height: 300,
        backgroundColor: 'rgba(153, 246, 228, 0.35)',
    },

    // ── Header ──
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        zIndex: 10,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    headerCenter: {
        alignItems: 'center',
        gap: 6,
    },
    avatarWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
    },
    avatarPulse: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(54, 226, 54, 0.2)',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#36e236',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
    },
    listeningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    listeningDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#36e236',
    },
    listeningText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(14, 27, 14, 0.75)',
        letterSpacing: 0.2,
    },

    // ── Messages ──
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 10,
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 13,
    },

    // ── Footer ──
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        paddingTop: 12,
        gap: 14,
        zIndex: 10,
    },

    // Suggestion chips
    suggestionsRow: {
        gap: 10,
        paddingRight: 8,
    },
    chip: {
        height: 38,
        paddingHorizontal: 18,
        borderRadius: 99,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#0e1b0e',
        whiteSpace: 'nowrap',
    },

    // Input bar
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
        borderRadius: 99,
        paddingLeft: 4,
        paddingRight: 6,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    inputIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#0e1b0e',
        paddingVertical: 10,
        maxHeight: 80,
    },
    inputRightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#36e236',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 3,
    },
    sendBtnDimmed: {
        backgroundColor: '#d1fae5',
        shadowOpacity: 0,
        elevation: 0,
    },

    // ── Dropdown menu ──
    menuOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    menuCard: {
        position: 'absolute',
        top: 80,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 6,
        minWidth: 170,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 16,
        gap: 10,
    },
    menuItemTextDanger: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ef4444',
    },
});

export default ChatScreen;
