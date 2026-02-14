import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await client.post('/auth/login', { email, password });
            const { accessToken, user } = response.data;

            setUserInfo(user);
            setUserToken(accessToken);
            await SecureStore.setItemAsync('userToken', accessToken);
            if (user) await SecureStore.setItemAsync('userInfo', JSON.stringify(user));

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setIsLoading(true);
        try {
            await client.post('/auth/register', { username, email, password });
            // Auto login after register
            await login(email, password);
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userInfo');
            setUserToken(null);
            setUserInfo(null);
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            setIsLoading(false);
        }
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await SecureStore.getItemAsync('userToken');
            let userInfo = await SecureStore.getItemAsync('userInfo');

            if (userToken) {
                setUserToken(userToken);
                if (userInfo) setUserInfo(JSON.parse(userInfo));
            }
        } catch (e) {
            console.log(`isLoggedIn error ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, register, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
