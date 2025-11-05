import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    // Variant styles
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
      case 'text':
        baseStyle.push(styles.textButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallButton);
        break;
      case 'medium':
        baseStyle.push(styles.mediumButton);
        break;
      case 'large':
        baseStyle.push(styles.largeButton);
        break;
    }

    // State styles
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidthButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];

    // Variant text styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButtonText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButtonText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButtonText);
        break;
      case 'text':
        baseStyle.push(styles.textButtonText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButtonText);
        break;
    }

    // Size text styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallButtonText);
        break;
      case 'medium':
        baseStyle.push(styles.mediumButtonText);
        break;
      case 'large':
        baseStyle.push(styles.largeButtonText);
        break;
    }

    return baseStyle;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return theme.colors.textInverse;
      case 'secondary':
        return theme.colors.textInverse;
      case 'outline':
        return theme.colors.primary;
      case 'text':
        return theme.colors.primary;
      default:
        return theme.colors.textInverse;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'text' ? theme.colors.primary : theme.colors.textInverse} 
          size="small" 
        />
      );
    }

    const iconComponent = icon && (
      <Ionicons 
        name={icon} 
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
        color={getIconColor()} 
        style={title && iconPosition === 'left' ? { marginRight: 8 } : title && iconPosition === 'right' ? { marginLeft: 8 } : {}}
      />
    );

    const textComponent = title && (
      <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
    );

    if (!title) {
      return iconComponent;
    }

    if (!icon) {
      return textComponent;
    }

    return iconPosition === 'left' ? (
      <>
        {iconComponent}
        {textComponent}
      </>
    ) : (
      <>
        {textComponent}
        {iconComponent}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },

  // Variant styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
  },

  // Size styles
  smallButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },
  mediumButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 52,
  },

  // State styles
  disabledButton: {
    opacity: 0.6,
  },
  fullWidthButton: {
    width: '100%',
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Variant text styles
  primaryButtonText: {
    color: theme.colors.textInverse,
  },
  secondaryButtonText: {
    color: theme.colors.textInverse,
  },
  outlineButtonText: {
    color: theme.colors.primary,
  },
  textButtonText: {
    color: theme.colors.primary,
  },
  dangerButtonText: {
    color: theme.colors.textInverse,
  },

  // Size text styles
  smallButtonText: {
    fontSize: theme.fontSizes.sm,
  },
  mediumButtonText: {
    fontSize: theme.fontSizes.md,
  },
  largeButtonText: {
    fontSize: theme.fontSizes.lg,
  },
});

export default CustomButton;
