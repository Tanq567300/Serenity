import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import useAuthStore from '../stores/authStore';

const ProfileScreen = () => {
    const { logout, user } = useAuthStore();
    const userName = user?.name || 'Abhinav';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="settings" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4l4ZP8QfEHYeysThHgKnBfRF9d7tgFOwAYcWqzWU-UVr_jfz00nS6Y0NsMoFp5y5sl5zhWUZcgG3eD1sWU1ysepDNXOF3FNyItBcBK_n4RXhEGHnldYhDFM6b09ffoW_KlqDt4JgXbkBpBSkc9hgu4dZPh2Ez5Xc3fl7t4w3xBnT6oiq5Hrof7JdcoanS3Qyb116pVR4GtUcj1F91muWP6Ypr0AL6_FKitWFfBTWuUiSFItqywaI_K3xxc1dVheQz2p82VFLDrx2n' }}
                            style={styles.avatar}
                        />
                        <View style={styles.verifiedBadge}>
                            <MaterialIcons name="verified" size={14} color="#fff" />
                        </View>
                    </View>
                    <Text style={styles.nameText}>{userName}</Text>
                    <View style={styles.membershipBadge}>
                        <MaterialIcons name="workspace-premium" size={16} color="#36e236" />
                        <Text style={styles.membershipText}>PREMIUM MEMBER</Text>
                    </View>
                    <Text style={styles.joinDate}>Member since May 2023</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuHeader}>ACCOUNT & SAFETY</Text>

                    {[
                        { icon: 'person', label: 'Account Settings' },
                        { icon: 'notifications', label: 'Notification Preferences' },
                        { icon: 'security', label: 'Privacy & Security' },
                        { icon: 'help', label: 'Help & Support' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuIconBox}>
                                <MaterialIcons name={item.icon} size={24} color="#36e236" />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <MaterialIcons name="logout" size={20} color="#36e236" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>SERENITY v2.4.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfcfb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(54, 226, 54, 0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        borderColor: 'rgba(54, 226, 54, 0.2)',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#36e236',
        borderRadius: 12,
        padding: 4,
        borderWidth: 2,
        borderColor: '#fff',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    membershipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(54, 226, 54, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 6,
        marginBottom: 8,
    },
    membershipText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#36e236',
    },
    joinDate: {
        fontSize: 14,
        color: '#64748b',
    },
    menuSection: {
        paddingHorizontal: 16,
    },
    menuHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94a3b8',
        marginBottom: 16,
        paddingHorizontal: 8,
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(54, 226, 54, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#334155',
    },
    logoutSection: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(54, 226, 54, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(54, 226, 54, 0.2)',
        borderRadius: 12,
        paddingVertical: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#36e236',
    },
    versionText: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 12,
        color: '#94a3b8',
        letterSpacing: 1.5,
    },
});

export default ProfileScreen;
