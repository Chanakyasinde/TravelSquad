export const lightTheme = {
    colors: {
        primary: '#4F46E5', 
        primaryDark: '#4338CA', 
        secondary: '#EC4899', 
        background: '#F9FAFB', 
        surface: '#FFFFFF',
        text: {
            primary: '#111827', 
            secondary: '#6B7280',
            light: '#F3F4F6', 
            inverse: '#FFFFFF',
        },
        border: '#E5E7EB', 
        error: '#EF4444', 
        success: '#10B981', 
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        round: 9999,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700',
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
        },
        caption: {
            fontSize: 14,
            lineHeight: 20,
        },
        button: {
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
        },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 10,
        },
    },
};

export const darkTheme = {
    ...lightTheme,
    colors: {
        ...lightTheme.colors,
        background: '#111827', 
        surface: '#1F2937', 
        text: {
            primary: '#F9FAFB',
            secondary: '#9CA3AF', 
            light: '#374151', 
            inverse: '#FFFFFF',
        },
        border: '#374151', 
        overlay: 'rgba(0, 0, 0, 0.7)',
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 10,
        },
    },
};

export const theme = lightTheme;
