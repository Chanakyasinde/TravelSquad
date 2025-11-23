import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                } else {
                    setIsDarkMode(systemScheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsThemeLoaded(true);
            }
        };
        loadTheme();
    }, []);

    // Listen for system changes only if no preference is saved (optional, but good UX)
    // For now, let's stick to: if user hasn't manually set it (which we can't easily distinguish without more state), 
    // or just let manual override persist. 
    // Actually, if we save to storage, that IS the manual override.
    // So we don't auto-switch on system change if we have a saved value.
    // But if we want to support "System Default" later, we'd need a third state.
    // For this request: "if user selects dark mode... it should show preference".

    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    if (!isThemeLoaded) {
        return null; // Or a loading spinner / splash screen to prevent flash
    }

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
