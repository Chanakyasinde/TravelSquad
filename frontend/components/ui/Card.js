import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function Card({ children, style, variant = 'elevated' }) {
    const { theme } = useTheme();

    const isElevated = variant === 'elevated';

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.m,
            },
            isElevated && theme.shadows.sm,
            !isElevated && { borderWidth: 1, borderColor: theme.colors.border },
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16, 
    },
});
