import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import { buttonPressAnimation } from '../utils/animations';

/**
 * Custom Button Component
 * Reusable button with loading state and variants
 * Now with press animation
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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && !loading) {
      buttonPressAnimation(scale, 0.96, 100);
    }
  };
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
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle(), style]}
        onPress={onPress}
        onPressIn={handlePressIn}
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
    </Animated.View>
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
