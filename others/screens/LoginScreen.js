import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';
import authService from '../services/authService';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleInputBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      await actions.login(response.user);
      
      // Navigation will be handled automatically by the context change
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'This feature will be implemented soon. For demo purposes, use:\n\nStudent: student@college.edu / password123\nCR: cr@college.edu / password123\nAdmin: admin@college.edu / admin123',
      [{ text: 'OK' }]
    );
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      student: { email: 'student@college.edu', password: 'password123' },
      cr: { email: 'cr@college.edu', password: 'password123' },
      admin: { email: 'admin@college.edu', password: 'admin123' },
    };

    setFormData(credentials[role]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons 
              name="calendar" 
              size={50} 
              color={theme.colors.primary} 
            />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to CampusConnect</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <CustomInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            onBlur={() => handleInputBlur('email')}
            placeholder="Enter your email"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            touched={touched.email}
          />

          <CustomInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            onBlur={() => handleInputBlur('password')}
            placeholder="Enter your password"
            icon="lock-closed-outline"
            secureTextEntry={!showPassword}
            error={errors.password}
            touched={touched.password}
            style={{ marginBottom: theme.spacing.sm }}
          />

          {/* Show/Hide Password */}
          <TouchableOpacity
            style={styles.showPasswordContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.showPasswordText}>
              {showPassword ? "Hide" : "Show"} Password
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginButton}
          />

          {/* Demo Credentials */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Quick Demo Access:</Text>
            <View style={styles.demoButtons}>
              <CustomButton
                title="Student"
                onPress={() => fillDemoCredentials('student')}
                variant="outline"
                size="small"
                style={styles.demoButton}
              />
              <CustomButton
                title="CR"
                onPress={() => fillDemoCredentials('cr')}
                variant="outline"
                size="small"
                style={styles.demoButton}
              />
              <CustomButton
                title="Admin"
                onPress={() => fillDemoCredentials('admin')}
                variant="outline"
                size="small"
                style={styles.demoButton}
              />
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  showPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  showPasswordText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  demoContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  demoTitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  registerText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
