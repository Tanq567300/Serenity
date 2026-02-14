import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme';

const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isPrimary ? styles.primary : styles.outline,
                (disabled || loading) && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#FFF' : colors.primary} />
            ) : (
                <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        borderRadius: 16, // Soft rounded
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.s,
    },
    primary: {
        backgroundColor: colors.primary,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        ...typography.button,
        fontSize: 16,
    },
    textPrimary: {
        color: '#FFFFFF',
    },
    textOutline: {
        color: colors.primary,
    }
});

export default Button;
