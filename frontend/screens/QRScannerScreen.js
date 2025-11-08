import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Button from '../components/Button';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

const QRScannerScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(false);

  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  const getBarCodeScannerPermissions = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.warn('Permission request failed:', error);
      setHasPermission(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    try {
      // Try to parse QR code data
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'event_ticket' && qrData.eventId) {
        Alert.alert(
          '✅ Event Ticket',
          `Event: ${qrData.eventTitle || 'Event'}\nAttendee: ${qrData.attendeeName || 'Unknown'}\n\nThis is a valid CampusConnect event ticket!`,
          [
            {
              text: 'View Event',
              onPress: () => {
                navigation.replace('EventDetails', { eventId: qrData.eventId });
              },
            },
            {
              text: 'Scan Again',
              onPress: () => setScanned(false),
            },
          ]
        );
      } else if (qrData.type === 'event_checkin' && qrData.eventId) {
        Alert.alert(
          '✅ Check-in Successful',
          `Successfully checked in to: ${qrData.eventTitle || 'Event'}`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (qrData.eventId) {
                  navigation.replace('EventDetails', { eventId: qrData.eventId });
                } else {
                  setScanned(false);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not a valid CampusConnect event code.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      // If JSON parsing fails, show raw data
      Alert.alert(
        'QR Code Scanned',
        `Data: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  const toggleFlash = () => {
    setFlashMode(!flashMode);
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={COLORS.primary} />
        <Text style={styles.permissionTitle}>Requesting Camera Access</Text>
        <Text style={styles.permissionText}>Please wait...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off-outline" size={64} color={COLORS.error} />
        <Text style={styles.permissionTitle}>No Camera Access</Text>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes. Please enable camera access in your device settings.
        </Text>
        <Button
          title="Go to Settings"
          onPress={() => Alert.alert('Settings', 'Please enable camera permissions in your device settings')}
          style={styles.permissionButton}
        />
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.permissionButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity 
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <Ionicons 
            name={flashMode ? "flash" : "flash-off"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Scanner */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
        type={BarCodeScanner.Constants.Type.back}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.overlayTop}>
            <Text style={styles.instructionText}>
              Position QR code within the frame
            </Text>
          </View>
          
          {/* Scanner frame */}
          <View style={styles.scannerFrame}>
            <View style={styles.frameCorners}>
              {/* Top-left corner */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              {/* Top-right corner */}
              <View style={[styles.corner, styles.cornerTopRight]} />
              {/* Bottom-left corner */}
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              {/* Bottom-right corner */}
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            
            {scanned && (
              <View style={styles.scannedOverlay}>
                <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                <Text style={styles.scannedText}>Scanned!</Text>
              </View>
            )}
          </View>
          
          {/* Bottom overlay with controls */}
          <View style={styles.overlayBottom}>
            {scanned && (
              <Button
                title="Scan Again"
                onPress={resetScanner}
                style={styles.scanAgainButton}
              />
            )}
            
            <Text style={styles.helpText}>
              Scan event QR tickets to verify attendance or check in to events
            </Text>
          </View>
        </View>
      </BarCodeScanner>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flashButton: {
    padding: 8,
  },
  scanner: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  permissionButton: {
    marginTop: 10,
    width: '80%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 100,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  scannerFrame: {
    alignSelf: 'center',
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  frameCorners: {
    flex: 1,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  scannedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  scanAgainButton: {
    marginBottom: 20,
    backgroundColor: COLORS.primary,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
    maxWidth: '90%',
  },
});

export default QRScannerScreen;

