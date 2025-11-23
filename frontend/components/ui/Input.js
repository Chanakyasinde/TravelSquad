import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { Body, Caption } from './Typography';

export default function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    style,
    ...props
}) {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Body style={styles.label}>{label}</Body>}

            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: error ? theme.colors.error : (isFocused ? theme.colors.primary : theme.colors.border),
                    borderRadius: theme.borderRadius.m,
                }
            ]}>
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={theme.colors.text.secondary}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        { color: theme.colors.text.primary }
                    ]}
                    placeholderTextColor={theme.colors.text.secondary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
                        <Ionicons
                            name={rightIcon}
                            size={20}
                            color={theme.colors.text.secondary}
                            style={styles.rightIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Caption style={[styles.errorText, { color: theme.colors.error }]}>{error}</Caption>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 12,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    leftIcon: {
        marginRight: 8,
    },
    rightIcon: {
        marginLeft: 8,
    },
    errorText: {
        marginTop: 4,
    },
});
