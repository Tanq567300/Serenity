import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../stores/authStore';
import ScreenBackground from '../components/ScreenBackground';

// ─── Sub-screens ───────────────────────────────────────────────────────────────

const BackHeader = ({ title, onBack }) => (
    <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
    </View>
);

const AccountSettingsScreen = ({ onBack, user }) => {
    const [name, setName] = useState(user?.username || user?.name || '');
    const [email, setEmail] = useState(user?.email || 'testuser@mansik.com');
    return (
        <SafeAreaView style={styles.container}>
            <BackHeader title="Account Settings" onBack={onBack} />
            <ScrollView contentContainerStyle={styles.subContent}>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#94a3b8" />

                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#94a3b8" keyboardType="email-address" />

                <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert('Saved', 'Your changes have been saved (demo).')}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#fee2e2', marginTop: 8 }]} onPress={() => Alert.alert('Reset Password', 'A password reset email would be sent to ' + email)}>
                    <Text style={[styles.saveButtonText, { color: '#ef4444' }]}>Change Password</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const NotificationScreen = ({ onBack }) => {
    const [dailyReminder, setDailyReminder] = useState(true);
    const [weeklyInsights, setWeeklyInsights] = useState(true);
    const [moodAlerts, setMoodAlerts] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <BackHeader title="Notification Preferences" onBack={onBack} />
            <ScrollView contentContainerStyle={styles.subContent}>
                {[
                    { label: 'Daily Check-in Reminder', desc: 'Get reminded to log your mood', value: dailyReminder, onChange: setDailyReminder },
                    { label: 'Weekly Insights Report', desc: 'Receive your weekly pattern summary', value: weeklyInsights, onChange: setWeeklyInsights },
                    { label: 'Mood Drop Alerts', desc: 'Alert me when mood drops significantly', value: moodAlerts, onChange: setMoodAlerts },
                ].map((item, i) => (
                    <View key={i} style={styles.toggleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.toggleLabel}>{item.label}</Text>
                            <Text style={styles.toggleDesc}>{item.desc}</Text>
                        </View>
                        <Switch
                            value={item.value}
                            onValueChange={item.onChange}
                            trackColor={{ false: '#e2e8f0', true: 'rgba(54,226,54,0.4)' }}
                            thumbColor={item.value ? '#36e236' : '#94a3b8'}
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const SecurityScreen = ({ onBack }) => (
    <SafeAreaView style={styles.container}>
        <BackHeader title="Privacy & Security" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.subContent}>
            <View style={styles.infoCard}>
                <MaterialIcons name="lock" size={32} color="#36e236" />
                <Text style={styles.infoTitle}>Your data is encrypted</Text>
                <Text style={styles.infoDesc}>All your journal entries and conversations are encrypted at rest using AES-256-GCM.</Text>
            </View>
            {[
                { icon: 'storage', label: 'Data Retention', value: 'Kept for 12 months' },
                { icon: 'share', label: 'Data Sharing', value: 'Never shared with 3rd parties' },
                { icon: 'delete-forever', label: 'Delete My Data', value: 'Contact support', danger: true },
            ].map((item, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.menuItem}
                    onPress={() => item.danger && Alert.alert('Delete Data', 'To delete your account and all data, contact support@mansik.app')}
                >
                    <View style={styles.menuIconBox}>
                        <MaterialIcons name={item.icon} size={22} color={item.danger ? '#ef4444' : '#36e236'} />
                    </View>
                    <Text style={[styles.menuLabel, item.danger && { color: '#ef4444' }]}>{item.label}</Text>
                    <Text style={styles.menuValue}>{item.value}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </SafeAreaView>
);

const HelpScreen = ({ onBack }) => (
    <SafeAreaView style={styles.container}>
        <BackHeader title="Help & Support" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.subContent}>
            <View style={styles.infoCard}>
                <MaterialIcons name="support-agent" size={32} color="#36e236" />
                <Text style={styles.infoTitle}>We're here to help</Text>
                <Text style={styles.infoDesc}>Reach us anytime at support@mansik.app</Text>
            </View>
            {[
                { icon: 'article', label: 'FAQs', desc: 'Common questions answered' },
                { icon: 'bug-report', label: 'Report a Bug', desc: 'Tell us what went wrong' },
                { icon: 'rate-review', label: 'Leave a Review', desc: 'Help us improve' },
                { icon: 'privacy-tip', label: 'Privacy Policy', desc: 'How we handle your data' },
            ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.menuItem} onPress={() => Alert.alert(item.label, item.desc)}>
                    <View style={styles.menuIconBox}>
                        <MaterialIcons name={item.icon} size={22} color="#36e236" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Text style={styles.menuValue}>{item.desc}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    </SafeAreaView>
);

// ─── Main ProfileScreen ─────────────────────────────────────────────────────────

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { logout, user } = useAuthStore();
    const [subScreen, setSubScreen] = useState(null); // null | 'account' | 'notifications' | 'security' | 'help'

    const userName = user?.username || user?.name || user?.email?.split('@')[0] || 'You';
    const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

    // Render sub-screens
    if (subScreen === 'account') return <AccountSettingsScreen onBack={() => setSubScreen(null)} user={user} />;
    if (subScreen === 'notifications') return <NotificationScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === 'security') return <SecurityScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === 'help') return <HelpScreen onBack={() => setSubScreen(null)} />;

    return (
        <SafeAreaView style={styles.container}>
            <ScreenBackground variant="profile" />
            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 40 }} />
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.iconButton} onPress={() => setSubScreen('account')}>
                    <MaterialIcons name="settings" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: user?.profilePic || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4l4ZP8QfEHYeysThHgKnBfRF9d7tgFOwAYcWqzWU-UVr_jfz00nS6Y0NsMoFp5y5sl5zhWUZcgG3eD1sWU1ysepDNXOF3FNyItBcBK_n4RXhEGHnldYhDFM6b09ffoW_KlqDt4JgXbkBpBSkc9hgu4dZPh2Ez5Xc3fl7t4w3xBnT6oiq5Hrof7JdcoanS3Qyb116pVR4GtUcj1F91muWP6Ypr0AL6_FKitWFfBTWuUiSFItqywaI_K3xxc1dVheQz2p82VFLDrx2n' }}
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
                    <Text style={styles.joinDate}>Member since {joinDate}</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuHeader}>ACCOUNT & SAFETY</Text>

                    {[
                        { icon: 'person', label: 'Account Settings', key: 'account' },
                        { icon: 'notifications', label: 'Notification Preferences', key: 'notifications' },
                        { icon: 'security', label: 'Privacy & Security', key: 'security' },
                        { icon: 'help', label: 'Help & Support', key: 'help' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => setSubScreen(item.key)}>
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
                    <Text style={styles.versionText}>MANSIK v2.5.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(54, 226, 54, 0.1)',
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
    iconButton: { padding: 8, borderRadius: 20 },
    scrollContent: { paddingBottom: 80 },
    subContent: { padding: 20, paddingBottom: 80 },
    profileSection: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
    avatarContainer: { position: 'relative', marginBottom: 16 },
    avatar: { width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: 'rgba(54, 226, 54, 0.2)' },
    verifiedBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#36e236', borderRadius: 12, padding: 4, borderWidth: 2, borderColor: '#fff' },
    nameText: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
    membershipBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(54, 226, 54, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, gap: 6, marginBottom: 8 },
    membershipText: { fontSize: 12, fontWeight: 'bold', color: '#36e236' },
    joinDate: { fontSize: 14, color: '#64748b' },
    menuSection: { paddingHorizontal: 16 },
    menuHeader: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 16, paddingHorizontal: 8, letterSpacing: 1 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2 },
    menuIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(54, 226, 54, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: '#334155' },
    menuValue: { fontSize: 12, color: '#94a3b8' },
    logoutSection: { paddingHorizontal: 16, marginTop: 24 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(54, 226, 54, 0.1)', borderWidth: 1, borderColor: 'rgba(54, 226, 54, 0.2)', borderRadius: 12, paddingVertical: 16 },
    logoutText: { fontSize: 16, fontWeight: 'bold', color: '#36e236' },
    versionText: { textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8', letterSpacing: 1.5 },
    // Sub-screen styles
    fieldLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 6, marginTop: 16 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#0f172a' },
    saveButton: { marginTop: 24, backgroundColor: 'rgba(54,226,54,0.1)', borderWidth: 1, borderColor: 'rgba(54,226,54,0.2)', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    saveButtonText: { fontSize: 15, fontWeight: '600', color: '#36e236' },
    toggleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#f1f5f9' },
    toggleLabel: { fontSize: 15, fontWeight: '500', color: '#0f172a' },
    toggleDesc: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    infoCard: { backgroundColor: 'rgba(54,226,54,0.05)', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(54,226,54,0.15)' },
    infoTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginTop: 10, marginBottom: 6 },
    infoDesc: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});

export default ProfileScreen;
