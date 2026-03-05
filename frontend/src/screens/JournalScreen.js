import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
    ActivityIndicator, ScrollView, Animated, Alert, PanResponder
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getMemories, createJournalEntry } from '../services/memoryApi';
import ScreenBackground from '../components/ScreenBackground';

// ─── Mood Slider ────────────────────────────────────────────────────────────
const MoodSlider = ({ value, onChange }) => {
    const TRACK_WIDTH = 280;
    const THUMB_SIZE = 28;
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const pan = React.useRef(new Animated.Value((value - 1) / 9 * TRACK_WIDTH)).current;
    const lastValue = React.useRef((value - 1) / 9 * TRACK_WIDTH);

    const getMoodColor = (score) => {
        if (score <= 3) return '#ef4444';
        if (score <= 5) return '#f59e0b';
        if (score <= 7) return '#36e236';
        return '#10b981';
    };

    const panResponder = React.useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => { pan.stopAnimation((v) => { lastValue.current = v; }); },
        onPanResponderMove: (_, gs) => {
            const next = clamp(lastValue.current + gs.dx, 0, TRACK_WIDTH);
            pan.setValue(next);
            const score = Math.round((next / TRACK_WIDTH) * 9) + 1;
            onChange(score);
        },
        onPanResponderRelease: (_, gs) => {
            const next = clamp(lastValue.current + gs.dx, 0, TRACK_WIDTH);
            lastValue.current = next;
        }
    })).current;

    const color = getMoodColor(value);

    return (
        <View style={sliderStyles.container}>
            <View style={sliderStyles.track}>
                <Animated.View style={[sliderStyles.fill, { width: pan, backgroundColor: color }]} />
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[sliderStyles.thumb, { left: pan, backgroundColor: color, transform: [{ translateX: -THUMB_SIZE / 2 }] }]}
                >
                    <Text style={sliderStyles.thumbText}>{value}</Text>
                </Animated.View>
            </View>
            <View style={sliderStyles.labels}>
                <Text style={sliderStyles.labelText}>😞 Low</Text>
                <Text style={sliderStyles.labelText}>😊 High</Text>
            </View>
        </View>
    );
};

const sliderStyles = StyleSheet.create({
    container: { alignItems: 'center', width: '100%', paddingHorizontal: 16, marginBottom: 8 },
    track: { width: 280, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, position: 'relative', justifyContent: 'center' },
    fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 4 },
    thumb: { position: 'absolute', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    thumbText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
    labels: { flexDirection: 'row', justifyContent: 'space-between', width: 280, marginTop: 8 },
    labelText: { fontSize: 12, color: '#94a3b8' },
});

// ─── Constants ──────────────────────────────────────────────────────────────
const EMOTIONS = [
    { label: 'Happy', icon: '😊', value: 'happy', color: '#fbbf24' },
    { label: 'Calm', icon: '😌', value: 'calm', color: '#10b981' },
    { label: 'Grateful', icon: '🙏', value: 'grateful', color: '#8b5cf6' },
    { label: 'Anxious', icon: '😰', value: 'anxious', color: '#f59e0b' },
    { label: 'Sad', icon: '😢', value: 'sad', color: '#6366f1' },
    { label: 'Frustrated', icon: '😤', value: 'frustrated', color: '#ef4444' },
    { label: 'Excited', icon: '🤩', value: 'excited', color: '#ec4899' },
    { label: 'Tired', icon: '😴', value: 'tired', color: '#94a3b8' },
];

const WRITING_PROMPTS = [
    "How are you feeling today, and why?",
    "What's one thing you're grateful for today?",
    "What challenged you today, and how did you handle it?",
    "What made you smile or feel proud today?",
    "What would make tomorrow better?",
];

// ─── Journal Editor ─────────────────────────────────────────────────────────
const JournalEditor = ({ onBack, onSaveSuccess }) => {
    const [text, setText] = useState('');
    const [moodScore, setMoodScore] = useState(5);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [saving, setSaving] = useState(false);
    const [prompt] = useState(WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)]);
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    const handleSave = async () => {
        if (text.trim().length < 10) {
            Alert.alert('Too short', 'Please write a bit more before saving.');
            return;
        }
        setSaving(true);
        try {
            const entry = await createJournalEntry({ text, moodScore });
            Alert.alert(
                '✨ Entry Saved',
                `AI detected: ${entry.dominantEmotion}\nTags: ${entry.tags?.join(', ') || 'none'}`,
                [{ text: 'Great!', onPress: onSaveSuccess }]
            );
        } catch (err) {
            Alert.alert('Error', 'Failed to save your entry. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScreenBackground variant="journal" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Today's Entry</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.5 }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={styles.saveBtnText}>Analyse & Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.editorScroll} keyboardShouldPersistTaps="handled">

                {/* Writing Canvas */}
                <View style={styles.canvasCard}>
                    <Text style={styles.promptText}>✏️ {prompt}</Text>
                    <TextInput
                        style={styles.textCanvas}
                        multiline
                        placeholder="Start writing here... pour it all out. This is your safe space."
                        placeholderTextColor="#cbd5e1"
                        value={text}
                        onChangeText={setText}
                        textAlignVertical="top"
                        autoFocus
                    />
                    <Text style={styles.wordCount}>{wordCount} {wordCount === 1 ? 'word' : 'words'}</Text>
                </View>

                {/* Mood Score */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>How's your mood right now?</Text>
                    <MoodSlider value={moodScore} onChange={setMoodScore} />
                </View>

                {/* Emotion Picker */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>What best describes your feeling?</Text>
                    <View style={styles.emotionGrid}>
                        {EMOTIONS.map((e) => (
                            <TouchableOpacity
                                key={e.value}
                                style={[
                                    styles.emotionChip,
                                    selectedEmotion === e.value && { backgroundColor: e.color, borderColor: e.color }
                                ]}
                                onPress={() => setSelectedEmotion(e.value)}
                            >
                                <Text style={styles.emotionIcon}>{e.icon}</Text>
                                <Text style={[
                                    styles.emotionLabel,
                                    selectedEmotion === e.value && { color: '#fff' }
                                ]}>{e.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.aiNote}>
                        <MaterialIcons name="auto-awesome" size={12} color="#36e236" /> AI will also detect your emotion from your writing
                    </Text>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <MaterialIcons name="psychology" size={20} color="#36e236" />
                    <Text style={styles.infoText}>Mansik AI will analyse your entry, extract tags, and build your insights — all privately encrypted.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ─── Journal Viewer (read-only) ─────────────────────────────────────────────
const JournalViewer = ({ entry, onBack }) => {
    const emotion = EMOTIONS.find(e => e.value === entry.dominantEmotion);
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const moodColor = (entry.averageMoodScore ?? 5) <= 3 ? '#ef4444'
        : (entry.averageMoodScore ?? 5) <= 6 ? '#f59e0b' : '#36e236';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                    <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Past Entry</Text>
                {/* spacer to centre title */}
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={viewerStyles.scroll}>
                {/* Date banner */}
                <View style={viewerStyles.dateBanner}>
                    <MaterialIcons name="menu-book" size={16} color="#36e236" />
                    <Text style={viewerStyles.dateText}>{formattedDate}</Text>
                </View>

                {/* Emotion + Mood Score */}
                <View style={viewerStyles.moodRow}>
                    <View style={[viewerStyles.emotionPill, { backgroundColor: (emotion?.color || '#94a3b8') + '22' }]}>
                        <Text style={viewerStyles.emotionIcon}>{emotion?.icon || '📝'}</Text>
                        <Text style={[viewerStyles.emotionName, { color: emotion?.color || '#94a3b8' }]}>
                            {entry.dominantEmotion
                                ? entry.dominantEmotion.charAt(0).toUpperCase() + entry.dominantEmotion.slice(1)
                                : 'Reflection'}
                        </Text>
                    </View>
                    <View style={[viewerStyles.scoreBadge, { borderColor: moodColor + '66', backgroundColor: moodColor + '18' }]}>
                        <Text style={[viewerStyles.scoreText, { color: moodColor }]}>
                            {entry.averageMoodScore ?? '—'} / 10
                        </Text>
                    </View>
                </View>

                {/* AI Summary */}
                <View style={viewerStyles.summaryCard}>
                    <View style={viewerStyles.summaryHeader}>
                        <MaterialIcons name="auto-awesome" size={14} color="#36e236" />
                        <Text style={viewerStyles.summaryLabel}>AI Summary</Text>
                    </View>
                    <Text style={viewerStyles.summaryText}>{entry.summary}</Text>
                </View>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                    <View style={viewerStyles.section}>
                        <Text style={viewerStyles.sectionTitle}>Topics</Text>
                        <View style={viewerStyles.tagsRow}>
                            {entry.tags.map((tag, i) => (
                                <View key={i} style={viewerStyles.tag}>
                                    <Text style={viewerStyles.tagText}>#{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Key Stressors */}
                {entry.keyStressors && entry.keyStressors.length > 0 && (
                    <View style={viewerStyles.section}>
                        <Text style={viewerStyles.sectionTitle}>Key Stressors</Text>
                        {entry.keyStressors.map((s, i) => (
                            <View key={i} style={viewerStyles.stressorRow}>
                                <View style={viewerStyles.stressorDot} />
                                <Text style={viewerStyles.stressorText}>{s}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Read-only notice */}
                <View style={viewerStyles.notice}>
                    <MaterialIcons name="lock" size={13} color="#94a3b8" />
                    <Text style={viewerStyles.noticeText}>Entries are encrypted and cannot be edited after saving.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const viewerStyles = StyleSheet.create({
    scroll: { padding: 20, paddingBottom: 60 },
    dateBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginBottom: 16,
    },
    dateText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
    moodRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20,
    },
    emotionPill: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99,
    },
    emotionIcon: { fontSize: 18 },
    emotionName: { fontSize: 14, fontWeight: '700' },
    scoreBadge: {
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1,
    },
    scoreText: { fontSize: 13, fontWeight: '700' },
    summaryCard: {
        backgroundColor: 'rgba(54,226,54,0.06)',
        borderRadius: 16, padding: 18, marginBottom: 20,
        borderWidth: 1, borderColor: 'rgba(54,226,54,0.18)',
    },
    summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
    summaryLabel: { fontSize: 11, fontWeight: '700', color: '#1a7a1a', letterSpacing: 0.5, textTransform: 'uppercase' },
    summaryText: { fontSize: 15, lineHeight: 24, color: '#1e293b' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: {
        backgroundColor: '#f1f5f9', borderRadius: 99,
        paddingHorizontal: 12, paddingVertical: 6,
    },
    tagText: { fontSize: 13, color: '#475569', fontWeight: '600' },
    stressorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
    stressorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f59e0b', marginTop: 7 },
    stressorText: { fontSize: 14, color: '#374151', lineHeight: 22, flex: 1 },
    notice: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9',
    },
    noticeText: { fontSize: 11, color: '#94a3b8', flex: 1 },
});

// ─── Journal List ────────────────────────────────────────────────────────────
const JournalList = ({ onWriteEntry, onOpenEntry }) => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchMemories = async (pageNum = 1) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);
            const result = await getMemories(pageNum, 10);
            if (pageNum === 1) setMemories(result.data);
            else setMemories(prev => [...prev, ...result.data]);
            setHasMore(result.pagination.current < result.pagination.pages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load memories:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => { fetchMemories(); }, []);

    const loadMore = () => { if (!loadingMore && hasMore) fetchMemories(page + 1); };

    const filteredMemories = searchText.trim()
        ? memories.filter(m =>
            m.summary?.toLowerCase().includes(searchText.toLowerCase()) ||
            m.dominantEmotion?.toLowerCase().includes(searchText.toLowerCase()) ||
            m.tags?.some(t => t.toLowerCase().includes(searchText.toLowerCase()))
        )
        : memories;

    const renderItem = ({ item }) => {
        const date = new Date(item.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const emotion = EMOTIONS.find(e => e.value === item.dominantEmotion);
        const moodColor = item.averageMoodScore <= 3 ? '#ef4444' : item.averageMoodScore <= 6 ? '#f59e0b' : '#36e236';

        return (
            <TouchableOpacity style={styles.card} onPress={() => onOpenEntry(item)} activeOpacity={0.7}>
                {/* Left: Date column */}
                <View style={styles.dateColumn}>
                    <Text style={styles.dateDayName}>{dayName}</Text>
                    <Text style={styles.dateDay}>{date.getDate()}</Text>
                    <Text style={styles.dateMonth}>{date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</Text>
                </View>

                {/* Divider */}
                <View style={[styles.cardDivider, { backgroundColor: moodColor }]} />

                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardTopRow}>
                        <Text style={styles.cardEmotion}>
                            {emotion?.icon || '📝'} {(item.dominantEmotion || 'Daily Reflection').charAt(0).toUpperCase() + (item.dominantEmotion || 'Daily Reflection').slice(1)}
                        </Text>
                        <Text style={[styles.moodBadge, { color: moodColor, borderColor: moodColor }]}>
                            {item.averageMoodScore}/10
                        </Text>
                    </View>
                    <Text style={styles.cardSummary} numberOfLines={2}>{item.summary}</Text>
                    {item.tags?.length > 0 && (
                        <View style={styles.tagsRow}>
                            {item.tags.slice(0, 3).map((t, i) => (
                                <View key={i} style={styles.tag}>
                                    <Text style={styles.tagText}>{t}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Chevron indicator */}
                <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                    <MaterialIcons name="chevron-right" size={18} color="#cbd5e1" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mood Journal</Text>
                <TouchableOpacity style={styles.writeButton} onPress={onWriteEntry}>
                    <MaterialIcons name="edit" size={18} color="#fff" />
                    <Text style={styles.writeButtonText}>Write</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search entries, emotions, tags..."
                    placeholderTextColor="#9ca3af"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <MaterialIcons name="close" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#36e236" />
                </View>
            ) : (
                <FlatList
                    data={filteredMemories}
                    renderItem={renderItem}
                    keyExtractor={item => item._id?.toString()}
                    contentContainerStyle={styles.listContent}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore
                            ? <ActivityIndicator size="small" color="#36e236" style={{ marginVertical: 20 }} />
                            : null
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📓</Text>
                            <Text style={styles.emptyTitle}>No entries yet</Text>
                            <Text style={styles.emptySubtitle}>Tap "Write" to pen your first journal entry</Text>
                            <TouchableOpacity style={styles.emptyButton} onPress={onWriteEntry}>
                                <Text style={styles.emptyButtonText}>Write Your First Entry</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={onWriteEntry}>
                <MaterialIcons name="edit" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// ─── Root JournalScreen ──────────────────────────────────────────────────────
const JournalScreen = () => {
    const navigation = useNavigation();
    const [view, setView] = useState('list'); // 'list' | 'viewer'
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    if (view === 'viewer' && selectedEntry) {
        return <JournalViewer entry={selectedEntry} onBack={() => setView('list')} />;
    }

    return (
        <JournalList
            key={refreshKey}
            onWriteEntry={() => navigation.navigate('MoodSlider')}
            onOpenEntry={(entry) => { setSelectedEntry(entry); setView('viewer'); }}
        />
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: 'rgba(54,226,54,0.1)',
        backgroundColor: '#fbfcfb',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
    iconButton: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(54,226,54,0.08)' },
    writeButton: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#36e236', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    },
    writeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    saveBtn: {
        backgroundColor: '#36e236', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, minWidth: 120, alignItems: 'center',
    },
    saveBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        margin: 16, backgroundColor: '#fff',
        borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: '#f1f5f9',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2,
    },
    searchInput: { flex: 1, fontSize: 14, color: '#334155' },
    listContent: { paddingHorizontal: 16, paddingBottom: 120 },
    card: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
        marginBottom: 12, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
        borderWidth: 1, borderColor: '#f1f5f9',
    },
    dateColumn: {
        width: 52, alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, backgroundColor: '#fafafa',
    },
    dateDayName: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
    dateDay: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', lineHeight: 28 },
    dateMonth: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
    cardDivider: { width: 3, marginVertical: 12 },
    cardContent: { flex: 1, padding: 12 },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cardEmotion: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
    moodBadge: {
        fontSize: 11, fontWeight: '700', borderWidth: 1, borderRadius: 8,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    cardSummary: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 6 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    tag: { backgroundColor: '#f1f5f9', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
    tagText: { fontSize: 10, color: '#64748b', fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingTop: 80 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
    emptySubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
    emptyButton: {
        backgroundColor: '#36e236', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
    },
    emptyButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    fab: {
        position: 'absolute', bottom: 88, right: 20, width: 56, height: 56, borderRadius: 28,
        backgroundColor: '#36e236', justifyContent: 'center', alignItems: 'center',
        shadowColor: '#36e236', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    // Editor styles
    editorScroll: { padding: 16, paddingBottom: 80 },
    canvasCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: '#f1f5f9',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
    },
    promptText: { fontSize: 13, color: '#36e236', fontWeight: '600', marginBottom: 12 },
    textCanvas: { fontSize: 16, color: '#0f172a', lineHeight: 26, minHeight: 200 },
    wordCount: { fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 8 },
    sectionCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16,
        borderWidth: 1, borderColor: '#f1f5f9',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4,
    },
    sectionLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 16 },
    emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    emotionChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fafafa',
    },
    emotionIcon: { fontSize: 16 },
    emotionLabel: { fontSize: 13, color: '#334155', fontWeight: '500' },
    aiNote: { fontSize: 11, color: '#94a3b8', marginTop: 12 },
    infoCard: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        backgroundColor: 'rgba(54,226,54,0.05)', borderRadius: 12, padding: 16,
        borderWidth: 1, borderColor: 'rgba(54,226,54,0.15)',
    },
    infoText: { flex: 1, fontSize: 12, color: '#64748b', lineHeight: 18 },
});

export default JournalScreen;
