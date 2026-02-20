/**
 * ScreenBackground
 * Renders the same soft ambient orb background used in ChatScreen.
 * Drop it as the first child of any screen's root View (position: 'relative').
 * Uses StyleSheet.absoluteFill so it never affects layout.
 *
 * Usage:
 *   <View style={{ flex: 1 }}>
 *     <ScreenBackground />
 *     ...rest of screen
 *   </View>
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

// Simulates CSS filter:blur() via layered semi-transparent concentric circles.
// Works cross-platform — no native modules / expo-blur needed.
const GlowOrb = ({ color, size, style }) => {
    const layers = [
        { scale: 2.4, opacity: 0.03 },
        { scale: 1.9, opacity: 0.055 },
        { scale: 1.5, opacity: 0.09 },
        { scale: 1.15, opacity: 0.14 },
        { scale: 0.75, opacity: 0.20 },
    ];
    return (
        <View
            pointerEvents="none"
            style={[
                { position: 'absolute', width: size, height: size, alignItems: 'center', justifyContent: 'center' },
                style,
            ]}
        >
            {layers.map((l, i) => (
                <View
                    key={i}
                    style={{
                        position: 'absolute',
                        width: size * l.scale,
                        height: size * l.scale,
                        borderRadius: size * l.scale,
                        backgroundColor: color,
                        opacity: l.opacity,
                    }}
                />
            ))}
        </View>
    );
};

const ScreenBackground = ({ variant = 'default' }) => {
    // Each variant shifts orb positions/colors slightly so screens feel
    // related but not identical.
    const configs = {
        default: [
            { color: '#86efac', size: 340, style: { top: -80, left: -80 } },  // soft green top-left
            { color: '#c4b5fd', size: 260, style: { bottom: 60, right: -60 } },  // lavender bottom-right
            { color: '#99f6e4', size: 200, style: { top: '38%', left: '20%' } }, // teal centre
        ],
        journal: [
            { color: '#a5f3fc', size: 320, style: { top: -60, right: -70 } },  // sky blue top-right
            { color: '#86efac', size: 240, style: { bottom: 80, left: -50 } },  // green bottom-left
            { color: '#c4b5fd', size: 180, style: { top: '45%', right: '15%' } },
        ],
        insights: [
            { color: '#6ee7b7', size: 300, style: { top: -70, left: -60 } },
            { color: '#a5b4fc', size: 220, style: { bottom: 100, right: -50 } },
            { color: '#fde68a', size: 160, style: { top: '30%', left: '30%' } }, // warm accent
        ],
        profile: [
            { color: '#c4b5fd', size: 320, style: { top: -70, right: -60 } },
            { color: '#86efac', size: 200, style: { bottom: 60, left: -40 } },
            { color: '#f9a8d4', size: 160, style: { top: '40%', left: '25%' } }, // rose accent
        ],
    };

    const orbs = configs[variant] || configs.default;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Cream/green base tint */}
            <View style={styles.base} />
            {orbs.map((orb, i) => (
                <GlowOrb key={i} color={orb.color} size={orb.size} style={orb.style} />
            ))}
            {/* Blur pass — blends orbs into a soft haze. experimentalBlurMethod enables Android support. */}
            <BlurView
                intensity={50}
                tint="light"
                experimentalBlurMethod="dimezisBlurView"
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f6faf6',
    },
});

export default ScreenBackground;
