import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { registerAdmin, saveAuthData } from '../api/api';

const AdminRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: '',
    role: 'admin', // Default to admin
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await registerAdmin({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        password: formData.password,
        role: formData.role,
      });

      if (response.success) {
        const user = response.data.student;
        await saveAuthData(response.data.token, user);

        Alert.alert(
          'Registration Successful!',
          'Your admin account has been created. You now have access to admin features.',
          [
            {
              text: 'Get Started',
              onPress: () => navigation.replace('Dashboard', { user }),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#EF4444" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#EF4444" />
          </View>
          <Text style={styles.title}>Create Admin Account</Text>
          <Text style={styles.subtitle}>
            Register as an administrator or class representative
          </Text>
        </View>

        {/* Registration Card */}
        <View style={styles.registrationCard}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            error={errors.name}
            icon="person-outline"
            autoCapitalize="words"
          />

          <InputField
            label="Admin Email"
            placeholder="Enter your admin email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            error={errors.phone}
            keyboardType="phone-pad"
            icon="call-outline"
            maxLength={10}
          />

          <InputField
            label="Department"
            placeholder="Enter your department"
            value={formData.department}
            onChangeText={(value) => handleChange('department', value)}
            error={errors.department}
            icon="business-outline"
            autoCapitalize="words"
          />

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>Account Type</Text>
            <View style={styles.roleOptions}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  formData.role === 'admin' && styles.roleOptionActive,
                ]}
                onPress={() => handleChange('role', 'admin')}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={formData.role === 'admin' ? '#EF4444' : COLORS.TEXT_SECONDARY}
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    formData.role === 'admin' && styles.roleOptionTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleOption,
                  formData.role === 'cr' && styles.roleOptionActive,
                ]}
                onPress={() => handleChange('role', 'cr')}
              >
                <Ionicons
                  name="people"
                  size={20}
                  color={formData.role === 'cr' ? '#EF4444' : COLORS.TEXT_SECONDARY}
                />
                <Text
                  style={[
                    styles.roleOptionText,
                    formData.role === 'cr' && styles.roleOptionTextActive,
                  ]}
                >
                  Class Rep
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            label="Password"
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            error={errors.password}
            secureTextEntry={!showPassword}
            icon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            icon="lock-closed-outline"
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <Button
            title={loading ? 'Creating Account...' : 'Create Admin Account'}
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Authorized Personnel Only</Text>
            <Text style={styles.warningText}>
              Admin accounts should only be created by authorized personnel. 
              Admins have special permissions to manage events, approve requests, and scan QR codes.
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Admin Permissions</Text>
          <View style={styles.permissionItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.WHITE} />
            <Text style={styles.permissionText}>Approve and reject events</Text>
          </View>
          <View style={styles.permissionItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.WHITE} />
            <Text style={styles.permissionText}>Scan QR codes for check-ins</Text>
          </View>
          <View style={styles.permissionItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.WHITE} />
            <Text style={styles.permissionText}>Manage event attendance</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EF4444',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.MEDIUM,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
    paddingHorizontal: SPACING.md,
  },
  registrationCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.MEDIUM,
  },
  roleSection: {
    marginBottom: SPACING.md,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    gap: SPACING.xs,
  },
  roleOptionActive: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  roleOptionTextActive: {
    color: '#EF4444',
  },
  registerButton: {
    marginTop: SPACING.md,
    backgroundColor: '#EF4444',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  loginLink: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  warningContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.sm,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  permissionText: {
    fontSize: 13,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
});

export default AdminRegisterScreen;
