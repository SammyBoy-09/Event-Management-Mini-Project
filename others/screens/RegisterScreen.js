import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';
import authService from '../services/authService';
import { departments } from '../data/mockData';
import { useApp } from '../context/AppContext';

const RegisterScreen = ({ navigation }) => {
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: '',
    year: '1st Year',
    semester: '1st',
    batch: '',
    phoneNumber: '',
    gender: 'Male',
    address: {
      city: '',
      state: '',
      country: 'India'
    }
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 1) {
      newErrors.lastName = 'Last name is required';
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Student ID validation
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (formData.studentId.trim().length < 3) {
      newErrors.studentId = 'Student ID must be at least 3 characters';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Address validation
    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Batch validation (auto-generate from current year and year)
    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(formData.year.charAt(0));
    const startYear = currentYear - (yearNumber - 1);
    const endYear = startYear + 3;
    formData.batch = `${startYear}-${endYear}`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      // Handle nested object fields like address.city
      const [parent, child] = field.split('.');
      setFormData({ 
        ...formData, 
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleInputBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleRegister = async () => {
    // Mark all fields as touched
    const fieldsToValidate = [
      'firstName', 'lastName', 'email', 'password', 'confirmPassword', 
      'studentId', 'department', 'phoneNumber', 
      'city', 'state'
    ];
    
    const newTouched = {};
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        studentId: formData.studentId.trim().toUpperCase(),
        department: formData.department,
        year: formData.year,
        semester: formData.semester,
        batch: formData.batch,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        address: {
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          country: formData.address.country
        }
      };

      const response = await authService.register(userData);
      await actions.login(response.user);
      
      Alert.alert(
        'Registration Successful',
        'Welcome to CampusConnect! Your account has been created successfully.',
        [{ text: 'OK' }]
      );
      
      // Navigation will be handled automatically by the context change
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred during registration',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const years = [
    { label: '1st Year', value: '1st Year' },
    { label: '2nd Year', value: '2nd Year' },
    { label: '3rd Year', value: '3rd Year' },
    { label: '4th Year', value: '4th Year' },
  ];

  const semesters = [
    { label: '1st', value: '1st' },
    { label: '2nd', value: '2nd' },
    { label: '3rd', value: '3rd' },
    { label: '4th', value: '4th' },
    { label: '5th', value: '5th' },
    { label: '6th', value: '6th' },
    { label: '7th', value: '7th' },
    { label: '8th', value: '8th' },
  ];

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
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CampusConnect today</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            onBlur={() => handleInputBlur('firstName')}
            placeholder="Enter your first name"
            icon="person-outline"
            error={errors.firstName}
            touched={touched.firstName}
          />

          <CustomInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            onBlur={() => handleInputBlur('lastName')}
            placeholder="Enter your last name"
            icon="person-outline"
            error={errors.lastName}
            touched={touched.lastName}
          />

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
            label="Student ID"
            value={formData.studentId}
            onChangeText={(value) => handleInputChange('studentId', value)}
            onBlur={() => handleInputBlur('studentId')}
            placeholder="Enter your student ID"
            icon="card-outline"
            autoCapitalize="characters"
            error={errors.studentId}
            touched={touched.studentId}
          />

          <CustomInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            onBlur={() => handleInputBlur('phoneNumber')}
            placeholder="Enter your phone number"
            icon="call-outline"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phoneNumber}
            touched={touched.phoneNumber}
          />

          {/* Gender Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Gender</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                style={styles.picker}
              >
                {genders.map((gender) => (
                  <Picker.Item 
                    key={gender.value} 
                    label={gender.label} 
                    value={gender.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Department Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Department</Text>
            <View style={[
              styles.pickerWrapper, 
              errors.department && touched.department && styles.pickerError
            ]}>
              <Picker
                selectedValue={formData.department}
                onValueChange={(value) => handleInputChange('department', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Department" value="" />
                {departments.map((dept) => (
                  <Picker.Item key={dept} label={dept} value={dept} />
                ))}
              </Picker>
            </View>
            {errors.department && touched.department && (
              <Text style={styles.errorText}>{errors.department}</Text>
            )}
          </View>

          {/* Year Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Year</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.year}
                onValueChange={(value) => handleInputChange('year', value)}
                style={styles.picker}
              >
                {years.map((year) => (
                  <Picker.Item 
                    key={year.value} 
                    label={year.label} 
                    value={year.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Semester Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Semester</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.semester}
                onValueChange={(value) => handleInputChange('semester', value)}
                style={styles.picker}
              >
                {semesters.map((semester) => (
                  <Picker.Item 
                    key={semester.value} 
                    label={semester.label} 
                    value={semester.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Address Section */}
          <Text style={[styles.pickerLabel, { marginTop: theme.spacing.lg, marginBottom: theme.spacing.md }]}>
            Address Information
          </Text>

          <CustomInput
            label="City"
            value={formData.address.city}
            onChangeText={(value) => handleInputChange('address.city', value)}
            onBlur={() => handleInputBlur('city')}
            placeholder="Enter your city"
            icon="location-outline"
            error={errors.city}
            touched={touched.city}
          />

          <CustomInput
            label="State"
            value={formData.address.state}
            onChangeText={(value) => handleInputChange('address.state', value)}
            onBlur={() => handleInputBlur('state')}
            placeholder="Enter your state"
            icon="location-outline"
            error={errors.state}
            touched={touched.state}
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
          />

          <CustomInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            onBlur={() => handleInputBlur('confirmPassword')}
            placeholder="Confirm your password"
            icon="lock-closed-outline"
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
          />

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    paddingTop: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
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
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  pickerLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  picker: {
    height: 48,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  registerButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
