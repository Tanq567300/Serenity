import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import PatternDashboardScreen from '../screens/PatternDashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Journal', icon: 'menu-book', label: 'Journal' },
    { name: 'Insights', icon: 'insights', label: 'Insights' },
    { name: 'Profile', icon: 'person', label: 'Profile' },
];

// ── Dark pill color (same as bar, so active bubble is seamlessly connected) ──
const BAR_COLOR = '#ffffff';
const BUBBLE_COLOR = '#36e236';   // Mansik primary green
const ICON_ACTIVE = '#ffffff';
const ICON_INACTIVE = '#94a3b8';   // slate-400
const LABEL_ACTIVE = '#36e236';

// ── Single tab button ─────────────────────────────────────────────────────────
const TabButton = ({ tab, isFocused, onPress }) => {
    // Animates the bubble translateY and the label opacity
    const bubbleY = useRef(new Animated.Value(isFocused ? -26 : 0)).current;
    const labelAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    const inactiveAnim = useRef(new Animated.Value(isFocused ? 0 : 1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(bubbleY, {
                toValue: isFocused ? -26 : 0,
                useNativeDriver: true,
                speed: 20,
                bounciness: 8,
            }),
            Animated.timing(labelAnim, {
                toValue: isFocused ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(inactiveAnim, {
                toValue: isFocused ? 0 : 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isFocused]);

    return (
        <TouchableOpacity
            style={tabBtnStyles.root}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/*
             * Active state: a circle that translates UP, same color as the bar.
             * This creates the "notch hump" look — the circle appears to be
             * a bump rising out of the bar.
             */}
            <Animated.View
                style={[
                    tabBtnStyles.bubble,
                    { transform: [{ translateY: bubbleY }], opacity: labelAnim },
                ]}
            >
                <MaterialIcons name={tab.icon} size={22} color={ICON_ACTIVE} />
            </Animated.View>

            {/* Active label — shown below bubble, fades in */}
            <Animated.Text style={[tabBtnStyles.activeLabel, { opacity: labelAnim }]}>
                {tab.label}
            </Animated.Text>

            {/* Inactive icon — fades out when active */}
            <Animated.View style={[tabBtnStyles.inactiveIcon, { opacity: inactiveAnim }]}>
                <MaterialIcons name={tab.icon} size={22} color={ICON_INACTIVE} />
                <Text style={tabBtnStyles.inactiveLabel}>{tab.label}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const tabBtnStyles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        overflow: 'visible',
    },
    // The raised bubble — solid green, springs up above the white bar
    bubble: {
        position: 'absolute',
        top: 0,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: BUBBLE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#36e236',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 10,
    },
    activeLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: LABEL_ACTIVE,
        letterSpacing: 0.4,
        marginTop: 28,   // sits below the raised bubble's translated position
    },
    inactiveIcon: {
        position: 'absolute',
        alignItems: 'center',
        gap: 3,
    },
    inactiveLabel: {
        fontSize: 10,
        color: ICON_INACTIVE,
        fontWeight: '500',
    },
});

// ── Custom floating tab bar ───────────────────────────────────────────────────
const FloatingTabBar = ({ state, navigation }) => {
    return (
        // outerWrapper sits above the safe area; overflow:visible lets bubbles pop up
        <View style={barStyles.outerWrapper} pointerEvents="box-none">
            <View style={barStyles.pill}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const tab = TABS.find(t => t.name === route.name) || TABS[index];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabButton
                            key={route.key}
                            tab={tab}
                            isFocused={isFocused}
                            onPress={onPress}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const barStyles = StyleSheet.create({
    outerWrapper: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 62,
        backgroundColor: BAR_COLOR,
        borderRadius: 38,
        shadowColor: '#0e1b0e',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 14,
        borderWidth: 1,
        borderColor: 'rgba(54,226,54,0.15)',
        overflow: 'visible',
    },
});

// ── Navigator ─────────────────────────────────────────────────────────────────
const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <FloatingTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Journal" component={JournalScreen} />
            <Tab.Screen name="Insights" component={PatternDashboardScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
