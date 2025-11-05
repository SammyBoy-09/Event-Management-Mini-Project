import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { createEvent } from '../api/api';

const CATEGORIES = [
  'Technology',
  'Sports',
  'Cultural',
  'Academic',
  'Workshop',
  'Seminar',
  'Competition',
  'Social',
  'Other',
];

const CreateEventScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    location: '',
    organizer: '',
    category: 'Technology',
    maxAttendees: '',
    rsvpRequired: true,
    isPublic: true,
    tags: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setFormData({ ...formData, time: `${hours}:${minutes}` });
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter event title');
      return false;
    }
    if (formData.title.length < 3) {
      Alert.alert('Error', 'Title must be at least 3 characters');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter event description');
      return false;
    }
    if (formData.description.length < 20) {
      Alert.alert('Error', 'Description must be at least 20 characters');
      return false;
    }
    if (formData.date < new Date()) {
      Alert.alert('Error', 'Event date must be in the future');
      return false;
    }
    if (!formData.time) {
      Alert.alert('Error', 'Please select event time');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter event location');
      return false;
    }
    if (!formData.organizer.trim()) {
      Alert.alert('Error', 'Please enter organizer name');
      return false;
    }
    if (!formData.maxAttendees || parseInt(formData.maxAttendees) < 1) {
      Alert.alert('Error', 'Please enter valid maximum attendees (minimum 1)');
      return false;
    }
    if (parseInt(formData.maxAttendees) > 10000) {
      Alert.alert('Error', 'Maximum attendees cannot exceed 10,000');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date.toISOString(),
        time: formData.time,
        location: formData.location.trim(),
        organizer: formData.organizer.trim(),
        category: formData.category,
        maxAttendees: parseInt(formData.maxAttendees),
        rsvpRequired: formData.rsvpRequired,
        isPublic: formData.isPublic,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };

      await createEvent(eventData);
      
      Alert.alert(
        'Success',
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Title */}
          <InputField
            label="Event Title *"
            placeholder="Enter event title"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            icon="document-text"
            maxLength={200}
          />

          {/* Description */}
          <InputField
            label="Event Description *"
            placeholder="Describe your event (minimum 20 characters)"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            icon="list"
            multiline
            numberOfLines={4}
          />

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Ionicons name="grid" size={20} color={COLORS.TEXT_LIGHT} style={styles.pickerIcon} />
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                style={styles.picker}
              >
                {CATEGORIES.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.dateTimeText}>
                {formData.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Time *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.dateTimeText}>
                {formData.time || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Location */}
          <InputField
            label="Location *"
            placeholder="Enter event location"
            value={formData.location}
            onChangeText={(text) => handleInputChange('location', text)}
            icon="location"
          />

          {/* Organizer */}
          <InputField
            label="Organizer *"
            placeholder="Enter organizer name"
            value={formData.organizer}
            onChangeText={(text) => handleInputChange('organizer', text)}
            icon="person"
          />

          {/* Max Attendees */}
          <InputField
            label="Maximum Attendees *"
            placeholder="Enter maximum attendees"
            value={formData.maxAttendees}
            onChangeText={(text) => handleInputChange('maxAttendees', text)}
            icon="people"
            keyboardType="numeric"
          />

          {/* Tags */}
          <InputField
            label="Tags (Optional)"
            placeholder="Enter tags separated by commas"
            value={formData.tags}
            onChangeText={(text) => handleInputChange('tags', text)}
            icon="pricetag"
          />

          {/* Toggle Options */}
          <View style={styles.toggleSection}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => handleInputChange('rsvpRequired', !formData.rsvpRequired)}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.PRIMARY} />
                <Text style={styles.toggleText}>RSVP Required</Text>
              </View>
              <Ionicons
                name={formData.rsvpRequired ? 'toggle' : 'toggle-outline'}
                size={40}
                color={formData.rsvpRequired ? COLORS.PRIMARY : COLORS.TEXT_LIGHT}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => handleInputChange('isPublic', !formData.isPublic)}
            >
              <View style={styles.toggleLeft}>
                <Ionicons name="globe" size={24} color={COLORS.PRIMARY} />
                <Text style={styles.toggleText}>Public Event</Text>
              </View>
              <Ionicons
                name={formData.isPublic ? 'toggle' : 'toggle-outline'}
                size={40}
                color={formData.isPublic ? COLORS.PRIMARY : COLORS.TEXT_LIGHT}
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <Button
            title={loading ? 'Creating Event...' : 'Create Event'}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: 50,
    paddingBottom: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: SPACING.LG,
  },
  inputGroup: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },

  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingLeft: SPACING.SM,
  },
  pickerIcon: {
    marginRight: SPACING.SM,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: SPACING.MD,
    gap: SPACING.SM,
  },
  dateTimeText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.TEXT_DARK,
  },
  toggleSection: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.SM,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    ...SHADOWS.SMALL,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  toggleText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  submitButton: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.XL,
  },
});

export default CreateEventScreen;
