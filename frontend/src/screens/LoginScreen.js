import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../stores/authStore';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const success = await login(email, password);
        if (success) {
            // Navigation is handled by AppNavigator based on auth state, 
            // but we can explicitly navigate if needed or just wait for state change
        } else {
            Alert.alert('Login Failed', error || 'Something went wrong');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>S</Text>
                    </View>
                    <Text style={styles.title}>Serenity</Text>
                    <Text style={styles.subtitle}>Find your inner peace.</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        placeholder="hello@serenity.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <Input
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Button
                        title="Login"
                        onPress={handleLogin}
                        loading={isLoading}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>New here? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.link}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8f6', // background-light
        justifyContent: 'center',
    },
    content: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(54, 226, 54, 0.2)',
    },
    logoText: {
        fontSize: 40,
        color: '#36e236',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#1a2e1a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '300',
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 24,
        borderRadius: 24,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
    },
});

export default LoginScreen;
