import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

/**
 * Custom Input Field Component
 * Reusable input component with icon and validation
 */
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        error && styles.inputError,
        multiline && styles.inputContainerMultiline
      ]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? COLORS.error : COLORS.textLight}
            style={[styles.icon, multiline && styles.iconMultiline]}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize="none"
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  inputContainerMultiline: {
    minHeight: 100,
    height: 'auto',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  iconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default InputField;
