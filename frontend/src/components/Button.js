import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Button = ({ title, onPress, loading, disabled, style, textStyle }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                (disabled || loading) && styles.disabled
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#0e1b0e" />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#36e236',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12, // Rounded corners matching design
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0e1b0e', // Dark text on bright button
    },
    disabled: {
        opacity: 0.6,
    }
});

export default Button;
