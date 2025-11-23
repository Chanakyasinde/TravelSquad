import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

export default function Screen({ children, style, gradientBackground = false }) {
    const { theme, isDarkMode } = useTheme();

    const Wrapper = gradientBackground ? LinearGradient : View;
    const wrapperProps = gradientBackground
        ? {
            colors: isDarkMode
                ? [theme.colors.background, '#1E1B4B'] 
                : [theme.colors.background, '#E0E7FF'], 
            style: styles.container,
        }
        : {
            style: [styles.container, { backgroundColor: theme.colors.background }],
        };

    return (
        <Wrapper {...wrapperProps}>
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor="transparent"
                translucent
            />
            <SafeAreaView style={[styles.safeArea, style]}>
                {children}
            </SafeAreaView>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});
