// Theme configuration for CampusConnect
export const theme = {
  colors: {
    // Primary colors - Professional blue palette
    primary: '#2563EB',        // Bright blue
    primaryDark: '#1D4ED8',    // Darker blue
    primaryLight: '#3B82F6',   // Lighter blue
    
    // Secondary colors
    secondary: '#10B981',      // Green
    secondaryDark: '#059669',  // Dark green
    secondaryLight: '#34D399', // Light green
    
    // Accent colors
    accent: '#F59E0B',         // Amber
    accentDark: '#D97706',     // Dark amber
    accentLight: '#FCD34D',    // Light amber
    
    // Status colors
    success: '#10B981',        // Green
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#3B82F6',          // Blue
    
    // Neutral colors
    background: '#FFFFFF',      // White
    surface: '#F8FAFC',        // Very light gray
    card: '#FFFFFF',           // White
    border: '#E2E8F0',         // Light gray
    
    // Text colors
    text: '#1E293B',           // Dark gray
    textSecondary: '#64748B',  // Medium gray
    textLight: '#94A3B8',      // Light gray
    textInverse: '#FFFFFF',    // White
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Gradient colors
    gradientStart: '#2563EB',
    gradientEnd: '#1D4ED8',
  },
  
  // Typography
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 50,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export default theme;
