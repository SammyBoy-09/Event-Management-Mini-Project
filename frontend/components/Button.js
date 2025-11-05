import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

/**
 * Custom Button Component
 * Reusable button with loading state and variants
 */
const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // primary, secondary, outline
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;
    
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'outline':
        return styles.buttonOutline;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (disabled) return styles.textDisabled;
    
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.surface} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.small,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  text: {
    ...TYPOGRAPHY.button,
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: COLORS.surface,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.textLight,
  },
});

export default Button;
