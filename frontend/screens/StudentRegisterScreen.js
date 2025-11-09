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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { registerStudent, saveAuthData } from '../api/api';

// Dropdown options
const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Cyber Security',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Data Science',
  'Artificial Intelligence and Machine Learning',
];

const YEARS = ['1', '2', '3', '4'];
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const StudentRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);

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

    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
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
      const response = await registerStudent({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        usn: formData.usn.trim().toUpperCase(),
        password: formData.password,
        year: parseInt(formData.year),
        semester: parseInt(formData.semester),
        phone: formData.phone.trim(),
        gender: formData.gender,
        department: formData.department.trim(),
      });

      if (response.success) {
        const user = response.data.student;
        await saveAuthData(response.data.token, user);

        Alert.alert(
          'Registration Successful!',
          'Welcome to CampusConnect! Your account has been created.',
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
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
            <Ionicons name="person-add" size={48} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join CampusConnect to discover and manage campus events
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
            label="College Email"
            placeholder="Enter your college email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <InputField
            label="USN"
            placeholder="Enter your USN"
            value={formData.usn}
            onChangeText={(value) => handleChange('usn', value)}
            error={errors.usn}
            icon="card-outline"
            autoCapitalize="characters"
          />

          <InputField
            label="Phone Number"
            placeholder="Enter 10-digit phone number"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            error={errors.phone}
            keyboardType="phone-pad"
            icon="call-outline"
            maxLength={10}
          />

          {/* Department Dropdown */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Department</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, errors.department && styles.dropdownButtonError]}
              onPress={() => setShowDepartmentModal(true)}
            >
              <Ionicons name="school-outline" size={20} color={COLORS.TEXT_SECONDARY} style={styles.dropdownIcon} />
              <Text style={[styles.dropdownButtonText, !formData.department && styles.dropdownPlaceholder]}>
                {formData.department || 'Select your department'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
            {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}
          </View>

          <View style={styles.row}>
            {/* Year Dropdown */}
            <View style={styles.halfWidth}>
              <Text style={styles.dropdownLabel}>Year</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.year && styles.dropdownButtonError]}
                onPress={() => setShowYearModal(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.TEXT_SECONDARY} style={styles.dropdownIcon} />
                <Text style={[styles.dropdownButtonText, !formData.year && styles.dropdownPlaceholder]}>
                  {formData.year || 'Year'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>

            {/* Semester Dropdown */}
            <View style={styles.halfWidth}>
              <Text style={styles.dropdownLabel}>Semester</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.semester && styles.dropdownButtonError]}
                onPress={() => setShowSemesterModal(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.TEXT_SECONDARY} style={styles.dropdownIcon} />
                <Text style={[styles.dropdownButtonText, !formData.semester && styles.dropdownPlaceholder]}>
                  {formData.semester || 'Sem'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
              {errors.semester && <Text style={styles.errorText}>{errors.semester}</Text>}
            </View>
          </View>

          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'Male' && styles.genderButtonActive
                ]}
                onPress={() => handleChange('gender', 'Male')}
              >
                <Text style={[
                  styles.genderButtonText,
                  formData.gender === 'Male' && styles.genderButtonTextActive
                ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'Female' && styles.genderButtonActive
                ]}
                onPress={() => handleChange('gender', 'Female')}
              >
                <Text style={[
                  styles.genderButtonText,
                  formData.gender === 'Female' && styles.genderButtonTextActive
                ]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'Other' && styles.genderButtonActive
                ]}
                onPress={() => handleChange('gender', 'Other')}
              >
                <Text style={[
                  styles.genderButtonText,
                  formData.gender === 'Other' && styles.genderButtonTextActive
                ]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
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
            title={loading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('StudentLogin')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.infoText}>
            By creating an account, you'll be able to discover events, RSVP to them, 
            and receive notifications about upcoming activities on campus.
          </Text>
        </View>

        {/* Terms Section */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By registering, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>

      {/* Department Modal */}
      <Modal
        visible={showDepartmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDepartmentModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDepartmentModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Department</Text>
              <TouchableOpacity onPress={() => setShowDepartmentModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {DEPARTMENTS.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[
                    styles.modalItem,
                    formData.department === dept && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    handleChange('department', dept);
                    setShowDepartmentModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    formData.department === dept && styles.modalItemTextSelected
                  ]}>
                    {dept}
                  </Text>
                  {formData.department === dept && (
                    <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Modal */}
      <Modal
        visible={showYearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              {YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.modalItem,
                    formData.year === year && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    handleChange('year', year);
                    setShowYearModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    formData.year === year && styles.modalItemTextSelected
                  ]}>
                    Year {year}
                  </Text>
                  {formData.year === year && (
                    <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Semester Modal */}
      <Modal
        visible={showSemesterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSemesterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSemesterModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Semester</Text>
              <TouchableOpacity onPress={() => setShowSemesterModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              {SEMESTERS.map((sem) => (
                <TouchableOpacity
                  key={sem}
                  style={[
                    styles.modalItem,
                    formData.semester === sem && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    handleChange('semester', sem);
                    setShowSemesterModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    formData.semester === sem && styles.modalItemTextSelected
                  ]}>
                    Semester {sem}
                  </Text>
                  {formData.semester === sem && (
                    <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  registerButton: {
    marginTop: SPACING.md,
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
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginLeft: SPACING.sm,
  },
  termsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  genderContainer: {
    marginBottom: SPACING.md,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.sm,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  genderButtonText: {
    fontSize: 14,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: COLORS.WHITE,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginTop: SPACING.xs,
  },
  dropdownContainer: {
    marginBottom: SPACING.md,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.sm,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    minHeight: 50,
  },
  dropdownButtonError: {
    borderColor: COLORS.ERROR,
  },
  dropdownIcon: {
    marginRight: SPACING.sm,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT,
  },
  dropdownPlaceholder: {
    color: COLORS.TEXT_SECONDARY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '70%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalItemSelected: {
    backgroundColor: COLORS.PRIMARY + '10',
  },
  modalItemText: {
    fontSize: 15,
    color: COLORS.TEXT,
  },
  modalItemTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});

export default StudentRegisterScreen;
