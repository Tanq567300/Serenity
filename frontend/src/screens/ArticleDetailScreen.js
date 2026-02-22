import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenBackground from '../components/ScreenBackground';

const SOURCE_COLORS = {
    'Psych Central': '#2d6a4f',
    'Tiny Buddha': '#3d5a99',
    'Hey Sigmund': '#6b3fa0',
};


const openArticle = async (url) => {
    if (!url) {
        Alert.alert('Unavailable', 'No link available for this article.');
        return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
        await Linking.openURL(url);
    } else {
        Alert.alert('Error', 'Unable to open this link.');
    }
};

const ArticleDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { article } = route.params;

    const accentColor = SOURCE_COLORS[article.source] || '#509550';

    return (
        <SafeAreaView style={styles.container}>
            <ScreenBackground variant="default" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color="#0e1b0e" />
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    {/* Source badge */}
                    {article.source ? (
                        <View style={[styles.sourceBadge, { backgroundColor: `${accentColor}18` }]}>
                            <Text style={[styles.sourceText, { color: accentColor }]}>
                                {article.source.toUpperCase()}
                            </Text>
                        </View>
                    ) : null}

                    <Text style={styles.title}>{article.title}</Text>

                    {/* RSS snippet / description */}
                    {article.description ? (
                        <Text style={styles.snippet}>{article.description}</Text>
                    ) : null}

                    <View style={styles.divider} />

                    {/* Disclaimer */}
                    <View style={styles.disclaimerBox}>
                        <MaterialIcons name="info-outline" size={16} color="#9ca3af" />
                        <Text style={styles.disclaimerText}>
                            This content is sourced from {article.source || 'a trusted publisher'} and is for educational purposes only. Always consult a qualified mental health professional.
                        </Text>
                    </View>

                    {/* Read Full Article CTA */}
                    <TouchableOpacity
                        style={[styles.readButton, { backgroundColor: accentColor }]}
                        onPress={() => openArticle(article.url)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.readButtonText}>Read Full Article</Text>
                        <MaterialIcons name="open-in-new" size={18} color="#fff" />
                    </TouchableOpacity>

                    {/* Published metadata */}
                    {article.publishedAt ? (
                        <Text style={styles.metaText}>
                            Published {new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 60,
    },
    backButton: {
        margin: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        padding: 24,
    },
    sourceBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    sourceText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0e1b0e',
        lineHeight: 32,
        marginBottom: 12,
    },
    snippet: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 25,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#e8f3e8',
        marginVertical: 20,
    },
    disclaimerBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginBottom: 20,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#9ca3af',
        lineHeight: 18,
    },
    readButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    readButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    metaText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9ca3af',
    },
});

export default ArticleDetailScreen;
