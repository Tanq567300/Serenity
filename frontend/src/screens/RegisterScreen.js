import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, typography } from '../theme';

const RegisterScreen = ({ navigation }) => {
    const { register, isLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            await register(username, email, password);
        } catch (error) {
            const msg = error.response?.data?.message || 'Registration failed';
            Alert.alert('Error', msg);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Start your wellness journey today</Text>

                <Input
                    label="Username"
                    placeholder="Choose a username"
                    value={username}
                    onChangeText={setUsername}
                />
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Input
                    label="Password"
                    placeholder="Choose a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.spacer} />

                <Button title="Sign Up" onPress={handleRegister} loading={isLoading} />
                <Button
                    title="Already have an account? Login"
                    variant="outline"
                    onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
