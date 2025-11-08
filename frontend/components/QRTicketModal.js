import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';

/**
 * QR Ticket Modal Component
 * Displays a QR code ticket for event check-in
 */
const QRTicketModal = ({ 
  visible, 
  onClose, 
  event, 
  userData 
}) => {
  const qrRef = useRef();

  if (!event || !userData) return null;

  // Generate QR code data
  const qrData = JSON.stringify({
    type: 'event_ticket',
    eventId: event._id || event.id,
    eventTitle: event.title,
    attendeeId: userData._id || userData.id,
    attendeeName: userData.name,
    attendeeEmail: userData.email,
    rsvpDate: new Date().toISOString(),
    ticketId: `${event._id || event.id}-${userData._id || userData.id}-${Date.now()}`,
  });

  const handleShareTicket = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Share', 'Screenshot this QR code to share your ticket');
        return;
      }

      // Capture QR code as image
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Event Ticket',
        });
      } else {
        Alert.alert('Saved', 'QR code ticket saved to device');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share ticket. Please take a screenshot instead.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Event Ticket</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ticket Container */}
            <View style={styles.ticketContainer} ref={qrRef} collapsable={false}>
              {/* Ticket Header */}
              <View style={styles.ticketHeader}>
                <Ionicons name="ticket" size={32} color={COLORS.primary} />
                <Text style={styles.ticketBrand}>CampusConnect</Text>
              </View>

              {/* Event Info */}
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetail}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.eventDetailText}>
                    {formatDate(event.date)}
                  </Text>
                </View>
                <View style={styles.eventDetail}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Attendee Info */}
              <View style={styles.attendeeInfo}>
                <Text style={styles.attendeeLabel}>Attendee</Text>
                <Text style={styles.attendeeName}>{userData.name}</Text>
                <Text style={styles.attendeeEmail}>{userData.email}</Text>
              </View>

              {/* QR Code */}
              <View style={styles.qrContainer}>
                <QRCode
                  value={qrData}
                  size={220}
                  backgroundColor="white"
                  color={COLORS.primary}
                />
              </View>

              {/* Instructions */}
              <View style={styles.instructions}>
                <Text style={styles.instructionsTitle}>How to use:</Text>
                <Text style={styles.instructionsText}>
                  Show this QR code at the event entrance for quick check-in
                </Text>
              </View>

              {/* Ticket Footer */}
              <View style={styles.ticketFooter}>
                <Text style={styles.ticketId}>
                  Ticket ID: {`${event._id?.substring(0, 8)}...${userData._id?.substring(0, 4)}`}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShareTicket}
              >
                <Ionicons name="share-outline" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Share Ticket</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => Alert.alert('Screenshot', 'Take a screenshot to save this ticket to your device')}
              >
                <Ionicons name="download-outline" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Save Screenshot</Text>
              </TouchableOpacity>
            </View>

            {/* Info Note */}
            <View style={styles.infoNote}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoNoteText}>
                This QR ticket is unique to you. Don't share it with others to prevent unauthorized check-ins.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '95%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  ticketContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  eventDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  attendeeInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  attendeeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  attendeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  attendeeEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 25,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  instructions: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  ticketFooter: {
    marginTop: 15,
    alignItems: 'center',
  },
  ticketId: {
    fontSize: 10,
    color: COLORS.textLight,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 15,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    width: '45%',
  },
  actionButtonText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: '#E6F7FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 10,
    lineHeight: 18,
  },
});

export default QRTicketModal;
