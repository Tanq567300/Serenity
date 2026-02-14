import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    ActivityIndicator,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import useChatStore from '../stores/chatStore';
import ChatBubble from '../components/ChatBubble';
import { colors, spacing, typography } from '../theme';

const ChatScreen = ({ navigation }) => {
    const { logout, userInfo } = useContext(AuthContext);
    const {
        messages,
        startSession,
        sendMessage,
        isLoading, // Initial loading
        isTyping,  // AI typing state
        error,
        crisisMode,
        reset
    } = useChatStore();

    const [inputText, setInputText] = useState('');
    const flatListRef = useRef();

    // Initialize session on mount
    useEffect(() => {
        startSession();
        return () => reset(); // Cleanup on unmount
    }, []);

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
            timestamp={item.timestamp}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Serenity</Text>
                    <Text style={styles.headerSubtitle}>Here for you, {userInfo?.username}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Messages */}
            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Starting calm session...</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            )}

            {/* Typing Indicator */}
            {isTyping && (
                <View style={styles.typingContainer}>
                    <Text style={styles.typingText}>Serenity is typing...</Text>
                </View>
            )}

            {/* Error Toast (Simple) */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                style={styles.inputWrapper}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your feelings..."
                        placeholderTextColor={colors.textSecondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!isLoading && !isTyping && !crisisMode} // Disable input during crisis logic if needed, typically we want to allow talking unless strictly blocked
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isTyping}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        ...typography.h2,
        color: colors.primary,
    },
    headerSubtitle: {
        ...typography.caption,
    },
    logoutButton: {
        padding: spacing.s,
    },
    logoutText: {
        color: colors.textSecondary,
        fontWeight: '600'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.m,
        color: colors.textSecondary,
    },
    listContent: {
        padding: spacing.m,
        paddingBottom: spacing.xxl,
    },
    typingContainer: {
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.s,
    },
    typingText: {
        color: colors.textSecondary,
        fontStyle: 'italic',
        fontSize: 12
    },
    errorContainer: {
        backgroundColor: colors.error,
        padding: spacing.s,
        alignItems: 'center',
    },
    errorText: {
        color: '#FFF',
        fontSize: 12
    },
    inputWrapper: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.s,
        paddingHorizontal: spacing.m,
        marginVertical: spacing.s
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 20,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s, // multiline height adjustment
        minHeight: 40,
        maxHeight: 100,
        fontSize: 16,
        color: colors.text,
    },
    sendButton: {
        marginLeft: spacing.s,
        backgroundColor: colors.primary,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendButtonDisabled: {
        backgroundColor: colors.border,
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: '600'
    }
});

export default ChatScreen;
