import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, error, style }) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.s,
        width: '100%',
    },
    label: {
        ...typography.caption,
        fontSize: 14,
        marginBottom: spacing.xs,
        color: colors.text,
        fontWeight: '600'
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.m,
        fontSize: 16,
        color: colors.text,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: spacing.xs,
    }
});

export default Input;
