import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const JournalScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Mood Journal</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <MaterialIcons name="tune" size={24} color="#4b5563" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search your thoughts..."
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Today Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>TODAY</Text>
                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(54, 226, 54, 0.1)' }]}>
                            <MaterialIcons name="light-mode" size={24} color="#36e236" />
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Morning Reflection</Text>
                                <Text style={styles.cardTime}>08:30 AM</Text>
                            </View>
                            <Text style={styles.cardText} numberOfLines={2}>
                                I felt very energized after my walk today. The crisp air and the quiet neighborhood helped me clear my head before starting work...
                            </Text>
                            <View style={styles.tagsContainer}>
                                <View style={styles.tag}><Text style={styles.tagText}>ENERGIZED</Text></View>
                                <View style={styles.tag}><Text style={styles.tagText}>NATURE</Text></View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Yesterday Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>YESTERDAY • OCT 23</Text>

                    {/* Entry 1 */}
                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
                            <MaterialIcons name="dark-mode" size={24} color="#6366f1" />
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Late Night Thoughts</Text>
                                <Text style={styles.cardTime}>11:15 PM</Text>
                            </View>
                            <Text style={styles.cardText} numberOfLines={2}>
                                Reflecting on the meeting earlier, I feel proud of how I handled the feedback. It was tough but constructive...
                            </Text>
                        </View>
                    </View>

                    {/* Entry 2 */}
                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                            <MaterialIcons name="sentiment-satisfied" size={24} color="#f59e0b" />
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Coffee Shop Calm</Text>
                                <Text style={styles.cardTime}>02:45 PM</Text>
                            </View>
                            <Text style={styles.cardText} numberOfLines={2}>
                                Finally finished the book I've been reading for months. The ending was unexpected but very satisfying...
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Older Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>OCT 22</Text>
                    <View style={styles.card}>
                        <View style={[styles.iconBox, { backgroundColor: '#ffe4e6' }]}>
                            <MaterialIcons name="cloud" size={24} color="#f43f5e" />
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Rainy Afternoon</Text>
                                <Text style={styles.cardTime}>04:20 PM</Text>
                            </View>
                            <Text style={styles.cardText} numberOfLines={2}>
                                Feeling a bit sluggish today. The rain is nice but it's making me want to just stay in bed and watch movies...
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <MaterialIcons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfcfb',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: 'rgba(251, 252, 251, 0.8)',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0e1b0e',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(54, 226, 54, 0.1)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#334155',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
    },
    cardTime: {
        fontSize: 11,
        color: '#94a3b8',
    },
    cardText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    tag: {
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748b',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#36e236',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
});

export default JournalScreen;
