import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  touched,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const hasError = error && touched;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        hasError && styles.inputContainerError,
        !editable && styles.inputContainerDisabled,
        style
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={hasError ? theme.colors.error : theme.colors.textSecondary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          {...props}
        />
      </View>
      
      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {maxLength && (
        <Text style={styles.characterCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  inputContainerDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  characterCount: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
});

export default CustomInput;
