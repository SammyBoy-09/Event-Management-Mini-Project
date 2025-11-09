import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { createEvent, uploadEventImage } from '../api/api';

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
    image: null, // Will store Cloudinary URL
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Local image URI for preview

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

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload event images!'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Landscape aspect ratio for event flyers
        quality: 0.8, // Good quality while keeping file size reasonable
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        
        // Upload immediately to Cloudinary
        await handleImageUpload(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleImageUpload = async (imageUri) => {
    try {
      setUploadingImage(true);

      // Create form data
      const formDataImage = new FormData();
      
      // Get file extension from URI
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formDataImage.append('image', {
        uri: imageUri,
        name: `event-image.${fileType}`,
        type: `image/${fileType}`,
      });

      // Upload to backend
      const response = await uploadEventImage(formDataImage);
      
      if (response.success) {
        // Store Cloudinary URL in form data
        setFormData({ ...formData, image: response.data.imageUrl });
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload image. Please try again.');
      // Clear the selected image on error
      setSelectedImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSelectedImage(null);
            setFormData({ ...formData, image: null });
          },
        },
      ]
    );
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
        image: formData.image, // Include Cloudinary URL
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

          {/* Event Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Flyer/Poster (Optional)</Text>
            <Text style={styles.helperText}>
              Upload an event flyer, poster, or invitation image
            </Text>
            
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                {uploadingImage && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                )}
                {!uploadingImage && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <Ionicons name="close-circle" size={30} color={COLORS.ERROR} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
                disabled={uploadingImage}
              >
                <Ionicons name="image" size={32} color={COLORS.PRIMARY} />
                <Text style={styles.imagePickerText}>
                  {uploadingImage ? 'Uploading...' : 'Choose Image'}
                </Text>
                <Text style={styles.imagePickerHint}>
                  JPG, PNG, GIF, or WebP • Max 5MB
                </Text>
              </TouchableOpacity>
            )}
          </View>

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
  helperText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
    marginBottom: SPACING.SM,
  },
  imagePickerButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: RADIUS.SM,
    padding: SPACING.XL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT,
    borderStyle: 'dashed',
    marginTop: SPACING.SM,
    ...SHADOWS.SMALL,
  },
  imagePickerText: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginTop: SPACING.SM,
  },
  imagePickerHint: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: SPACING.SM,
    borderRadius: RADIUS.SM,
    overflow: 'hidden',
    ...SHADOWS.SMALL,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.SM,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    ...SHADOWS.MEDIUM,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '600',
    marginTop: SPACING.SM,
  },
});

export default CreateEventScreen;
