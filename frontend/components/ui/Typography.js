import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Typography = ({ style, children, variant, ...props }) => {
    const { theme } = useTheme();

    const variantStyle = theme.typography[variant] || theme.typography.body;

    const defaultColor = variant === 'caption' ? theme.colors.text.secondary : theme.colors.text.primary;

    return (
        <Text
            style={[
                variantStyle,
                { color: defaultColor },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const Title = (props) => <Typography variant="h1" {...props} />;
export const Subtitle = (props) => <Typography variant="h3" {...props} />;
export const Body = (props) => <Typography variant="body" {...props} />;
export const Caption = (props) => <Typography variant="caption" {...props} />;
