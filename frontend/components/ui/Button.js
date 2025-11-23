import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

export default function Button({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style
}) {
    const { theme } = useTheme();

    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    const getBackgroundColor = () => {
        if (disabled) return [theme.colors.text.secondary, theme.colors.text.secondary];
        if (isPrimary) return [theme.colors.primary, theme.colors.primaryDark];
        if (isSecondary) return [theme.colors.secondary, theme.colors.secondary];
        return ['transparent', 'transparent'];
    };

    const getTextColor = () => {
        if (isOutline) return theme.colors.primary;
        return theme.colors.text.inverse;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.container,
                { borderRadius: theme.borderRadius.round },
                isOutline && {
                    borderWidth: 1,
                    borderColor: theme.colors.primary
                },
                style
            ]}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={getBackgroundColor()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient]}
            >
                {loading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <Text style={[
                        styles.text,
                        theme.typography.button,
                        { color: getTextColor() }
                    ]}>
                        {title}
                    </Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        // Typography styles handled inline via theme
    },
});
