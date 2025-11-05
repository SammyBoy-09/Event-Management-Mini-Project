import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import theme from '../utils/theme';
import { useApp } from '../context/AppContext';
import { eventCategories } from '../data/mockData';
import eventService from '../services/eventService';

const CreateEventScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const { user } = state;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '09:00',
    location: '',
    category: 'Technology',
    maxAttendees: '',
    rsvpRequired: true,
    isPublic: true,
    tags: '',
    image: null,
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (!formData.maxAttendees) {
      newErrors.maxAttendees = 'Maximum attendees is required';
    } else if (parseInt(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = 'Must allow at least 1 attendee';
    } else if (parseInt(formData.maxAttendees) > 10000) {
      newErrors.maxAttendees = 'Maximum attendees cannot exceed 10,000';
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.date = 'Event date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleInputBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      handleInputChange('time', timeString);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        handleInputChange('image', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    const fieldsToValidate = ['title', 'description', 'location', 'maxAttendees'];
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
      const eventData = {
        ...formData,
        organizer: user?.role === 'admin' ? user.department : `${user.name} (${user.department})`,
        createdBy: user?.id,
        maxAttendees: parseInt(formData.maxAttendees),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      const newEvent = await eventService.createEvent(eventData);
      actions.addEvent(newEvent);

      Alert.alert(
        'Event Created',
        user?.role === 'admin' 
          ? 'Your event has been created and is now live!'
          : 'Your event has been submitted for approval. You will be notified once it\'s reviewed.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

      // Add notification
      actions.addNotification({
        title: 'Event Created',
        message: `"${eventData.title}" has been ${user?.role === 'admin' ? 'created' : 'submitted for approval'}`,
        type: 'success',
        eventId: newEvent.id,
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create New Event</Text>
            <Text style={styles.subtitle}>
              {user?.role === 'admin' 
                ? 'Create and publish events instantly'
                : 'Submit event for approval'
              }
            </Text>
          </View>

          {/* Event Image */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Event Image</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {formData.image ? (
                <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.imageUploadPlaceholder}>
                  <Ionicons name="camera-outline" size={40} color={theme.colors.textLight} />
                  <Text style={styles.imageUploadText}>Tap to add event image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <CustomInput
              label="Event Title"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              onBlur={() => handleInputBlur('title')}
              placeholder="Enter event title"
              error={errors.title}
              touched={touched.title}
              maxLength={100}
            />

            <CustomInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              onBlur={() => handleInputBlur('description')}
              placeholder="Describe your event..."
              multiline
              numberOfLines={4}
              error={errors.description}
              touched={touched.description}
              maxLength={500}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Category</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  style={styles.picker}
                >
                  {eventCategories.map((category) => (
                    <Picker.Item 
                      key={category.id} 
                      label={category.name} 
                      value={category.name} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.dateTimeText}>{formatDate(formData.date)}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.dateTimeText}>{formatTime(formData.time)}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textLight} />
            </TouchableOpacity>

            {errors.date && (
              <Text style={styles.errorText}>{errors.date}</Text>
            )}
          </View>

          {/* Location and Capacity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Capacity</Text>
            
            <CustomInput
              label="Location"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              onBlur={() => handleInputBlur('location')}
              placeholder="Enter event location"
              icon="location-outline"
              error={errors.location}
              touched={touched.location}
            />

            <CustomInput
              label="Maximum Attendees"
              value={formData.maxAttendees}
              onChangeText={(value) => handleInputChange('maxAttendees', value)}
              onBlur={() => handleInputBlur('maxAttendees')}
              placeholder="Enter maximum number of attendees"
              icon="people-outline"
              keyboardType="numeric"
              error={errors.maxAttendees}
              touched={touched.maxAttendees}
            />
          </View>

          {/* Additional Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Settings</Text>
            
            <CustomInput
              label="Tags (comma separated)"
              value={formData.tags}
              onChangeText={(value) => handleInputChange('tags', value)}
              placeholder="e.g. technology, workshop, coding"
              icon="pricetag-outline"
            />

            {/* Toggle Switches */}
            <View style={styles.toggleSection}>
              <TouchableOpacity 
                style={styles.toggleItem}
                onPress={() => handleInputChange('rsvpRequired', !formData.rsvpRequired)}
              >
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleTitle}>RSVP Required</Text>
                  <Text style={styles.toggleSubtitle}>Require attendees to confirm attendance</Text>
                </View>
                <View style={[styles.toggle, formData.rsvpRequired && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, formData.rsvpRequired && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.toggleItem}
                onPress={() => handleInputChange('isPublic', !formData.isPublic)}
              >
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleTitle}>Public Event</Text>
                  <Text style={styles.toggleSubtitle}>
                    {formData.isPublic ? 'Visible to all students' : 'Private event'}
                  </Text>
                </View>
                <View style={[styles.toggle, formData.isPublic && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, formData.isPublic && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <CustomButton
            title={user?.role === 'admin' ? 'Create Event' : 'Submit for Approval'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          />

          {/* Date/Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${formData.time}:00`)}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
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
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  imageSection: {
    marginBottom: theme.spacing.xl,
  },
  imageUpload: {
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageUploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
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
  },
  picker: {
    height: 48,
    color: theme.colors.text,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minHeight: 48,
  },
  dateTimeText: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  toggleSection: {
    marginTop: theme.spacing.md,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  toggleContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  toggleTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.textInverse,
    ...theme.shadows.sm,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  submitButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default CreateEventScreen;
