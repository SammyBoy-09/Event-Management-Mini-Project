import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { buttonPressAnimation } from '../utils/animations';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';

/**
 * AnimatedButton Component
 * Button with press animation and haptic feedback
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {string} variant - Button variant: 'primary', 'secondary', 'outline', 'ghost'
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state
 * @param {object} style - Additional button styles
 * @param {object} textStyle - Additional text styles
 * @param {string} icon - Icon component (optional)
 */
const AnimatedButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && !loading) {
      buttonPressAnimation(scale, 0.95, 100);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostButton);
        break;
      default:
        baseStyle.push(styles.primaryButton);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
      default:
        baseStyle.push(styles.primaryText);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPressIn={handlePressIn}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' ? COLORS.WHITE : COLORS.PRIMARY} 
            size="small" 
          />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: RADIUS.LG,
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    ...SHADOWS.MEDIUM,
  },
  secondaryButton: {
    backgroundColor: COLORS.SECONDARY,
    ...SHADOWS.MEDIUM,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    opacity: 0.6,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: COLORS.WHITE,
  },
  secondaryText: {
    color: COLORS.WHITE,
  },
  outlineText: {
    color: COLORS.PRIMARY,
  },
  ghostText: {
    color: COLORS.PRIMARY,
  },
  disabledText: {
    color: COLORS.TEXT_LIGHT,
  },
});

export default AnimatedButton;
