import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { API_URL, ENV } from './src/config';

console.log('Serenity Environment:', ENV);
console.log('Serenity API URL:', API_URL);


export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <AppNavigator />
        </SafeAreaProvider>
    );
}
