/**
 * Color Palette for CampusConnect Event Management App
 * Professional and modern color scheme for campus events
 */

export const COLORS = {
  // Primary Colors
  primary: '#6C63FF',           // Vibrant Purple - Main brand color
  PRIMARY: '#6C63FF',           // Vibrant Purple (uppercase)
  primaryDark: '#5548E8',       // Darker purple for pressed states
  primaryLight: '#8A84FF',      // Lighter purple for highlights
  
  // Secondary Colors
  secondary: '#FF6584',         // Coral Pink - Accent color
  SECONDARY: '#FF6584',         // Coral Pink (uppercase)
  secondaryDark: '#E8476B',     // Darker coral
  secondaryLight: '#FF8AA3',    // Lighter coral
  
  // Tertiary Colors
  tertiary: '#4ECDC4',          // Teal - Success/Info color
  TERTIARY: '#4ECDC4',          // Teal (uppercase)
  tertiaryDark: '#3DB8B0',      // Darker teal
  tertiaryLight: '#6EDDD6',     // Lighter teal
  
  // Neutral Colors
  background: '#F8F9FE',        // Light background
  BACKGROUND: '#F8F9FE',        // Light background (uppercase)
  surface: '#FFFFFF',           // Card/Surface color
  WHITE: '#FFFFFF',             // White color (uppercase)
  text: '#2D3748',              // Primary text color
  TEXT: '#2D3748',              // Primary text color (uppercase)
  TEXT_DARK: '#1A202C',         // Darker text
  textSecondary: '#718096',     // Secondary text color
  textLight: '#A0AEC0',         // Light text/placeholders
  TEXT_LIGHT: '#A0AEC0',        // Light text (uppercase)
  
  // Status Colors
  success: '#48BB78',           // Green for success
  SUCCESS: '#48BB78',           // Green for success (uppercase)
  warning: '#F6AD55',           // Orange for warnings
  error: '#F56565',             // Red for errors
  ERROR: '#F56565',             // Red for errors (uppercase)
  info: '#4299E1',              // Blue for info
  
  // Additional UI Colors
  border: '#E2E8F0',            // Border color
  BORDER: '#E2E8F0',            // Border color (uppercase)
  divider: '#EDF2F7',           // Divider lines
  disabled: '#CBD5E0',          // Disabled state
  
  // Dark Mode (for future implementation)
  dark: {
    background: '#1A202C',
    surface: '#2D3748',
    text: '#F7FAFC',
    textSecondary: '#E2E8F0',
  },
  
  // Gradient Colors
  gradientStart: '#6C63FF',
  gradientEnd: '#FF6584',
};

/**
 * Typography Styles
 */
export const TYPOGRAPHY = {
  SIZES: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.text,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    color: COLORS.textLight,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
};

/**
 * Spacing Constants
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Border Radius
 */
export const RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

/**
 * Shadow Styles
 */
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
