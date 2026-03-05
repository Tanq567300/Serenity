import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const TypingIndicator = () => {
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.text, { opacity }]}>
                Mansik is writing...
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        alignSelf: 'flex-start',
        marginLeft: 8,
    },
    text: {
        fontSize: 12,
        color: '#509550',
        fontStyle: 'italic',
    },
});

export default TypingIndicator;
