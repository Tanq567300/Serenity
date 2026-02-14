export const colors = {
    background: '#F8F9FA', // Soft off-white
    surface: '#FFFFFF',
    primary: '#6B9080',    // Sage Green - Calming, nature-inspired
    secondary: '#A4C3B2',  // Lighter Sage
    accent: '#EAF4F4',     // Mint White
    text: '#2D3748',       // Dark Gray (softer than black)
    textSecondary: '#718096',
    error: '#E53E3E',
    success: '#38A169',
    border: '#E2E8F0',

    // Chat specific
    userBubble: '#6B9080',
    userText: '#FFFFFF',
    aiBubble: '#F0F4F8',
    aiText: '#2D3748',

    crisis: '#FED7D7',     // Soft Red background for crisis
    crisisText: '#C53030'
};

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40
};

export const typography = {
    h1: { fontSize: 28, fontWeight: '700', color: colors.text },
    h2: { fontSize: 24, fontWeight: '600', color: colors.text },
    body: { fontSize: 16, color: colors.text, lineHeight: 24 },
    caption: { fontSize: 12, color: colors.textSecondary },
    button: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' }
};
