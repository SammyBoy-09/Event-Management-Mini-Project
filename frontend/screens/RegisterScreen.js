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
import { Picker } from '@react-native-picker/picker';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { registerStudent, saveAuthData } from '../api/api';

/**
 * Register Screen
 * Handles new student registration
 */
const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    password: '',
    confirmPassword: '',
    year: '',
    semester: '',
    phone: '',
    gender: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Information Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Other',
  ];

  // Update form field
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // USN validation
    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Year validation
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    // Semester validation
    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await registerStudent({
        ...registrationData,
        email: registrationData.email.toLowerCase(),
        usn: registrationData.usn.toUpperCase(),
        year: parseInt(registrationData.year),
        semester: parseInt(registrationData.semester),
      });

      if (response.success) {
        // Save token and user data
        await saveAuthData(response.data.token, response.data.student);

        // Show success message
        Alert.alert('Success', 'Registration successful!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Dashboard', { user: response.data.student }),
          },
        ]);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred. Please try again.'
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="person-add-outline" size={48} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CampusConnect today</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            icon="person-outline"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            error={errors.name}
          />

          <InputField
            label="USN (University Seat Number)"
            placeholder="Enter your USN"
            icon="card-outline"
            value={formData.usn}
            onChangeText={(value) => handleChange('usn', value)}
            error={errors.usn}
            autoCapitalize="characters"
          />

          <InputField
            label="Email Address"
            placeholder="Enter your email"
            icon="mail-outline"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            error={errors.email}
          />

          <InputField
            label="Password"
            placeholder="Create a strong password"
            icon="lock-closed-outline"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            error={errors.password}
          />

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            icon="lock-closed-outline"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Year</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.year}
                  onValueChange={(value) => handleChange('year', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Year" value="" />
                  <Picker.Item label="1st Year" value="1" />
                  <Picker.Item label="2nd Year" value="2" />
                  <Picker.Item label="3rd Year" value="3" />
                  <Picker.Item label="4th Year" value="4" />
                </Picker>
              </View>
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Semester</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.semester}
                  onValueChange={(value) => handleChange('semester', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Sem" value="" />
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <Picker.Item key={sem} label={`Sem ${sem}`} value={sem.toString()} />
                  ))}
                </Picker>
              </View>
              {errors.semester && <Text style={styles.errorText}>{errors.semester}</Text>}
            </View>
          </View>

          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            icon="call-outline"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            keyboardType="phone-pad"
            error={errors.phone}
            maxLength={10}
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Department</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.department}
                onValueChange={(value) => handleChange('department', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Department" value="" />
                {departments.map((dept) => (
                  <Picker.Item key={dept} label={dept} value={dept} />
                ))}
              </Picker>
            </View>
            {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 0,
    padding: SPACING.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  registerButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
