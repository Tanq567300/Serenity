import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, typography } from '../theme';

const LoginScreen = ({ navigation }) => {
    const { login, isLoading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            await login(email, password);
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed';
            Alert.alert('Login Error', msg);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue your journey</Text>

                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.spacer} />

                <Button title="Login" onPress={handleLogin} loading={isLoading} />
                <Button
                    title="Create Account"
                    variant="outline"
                    onPress={() => navigation.navigate('Register')}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.l,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    spacer: {
        height: spacing.l,
    }
});

export default LoginScreen;
