import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../stores/authStore';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, isLoading, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f8f6' }}>
                <ActivityIndicator size="large" color="#36e236" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        {/* Main Tabs is the default authenticated screen */}
                        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                        {/* Chat is now a secondary screen accessed via FAB */}
                        <Stack.Screen
                            name="Chat"
                            component={ChatScreen}
                            options={{
                                animation: 'slide_from_bottom', // Nice transition for modal-like feel
                                presentation: 'card',
                            }}
                        />
                        <Stack.Screen
                            name="ArticleDetail"
                            component={ArticleDetailScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
