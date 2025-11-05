import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import QRScannerFallback from '../components/QRScannerFallback';
import theme from '../utils/theme';

// Dynamic import for BarCodeScanner to handle development issues
let BarCodeScanner = null;
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.warn('BarCodeScanner not available:', error);
}

const { width } = Dimensions.get('window');

const QRScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(false);

  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  const getBarCodeScannerPermissions = async () => {
    if (!BarCodeScanner) {
      setHasPermission(false);
      return;
    }
    
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
      
      if (qrData.type === 'event_checkin' && qrData.eventId) {
        Alert.alert(
          'Event Check-in',
          `Successfully checked in to: ${qrData.eventTitle || 'Event'}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to event details or reset scanner
                if (qrData.eventId) {
                  navigation.navigate('EventDetails', { eventId: qrData.eventId });
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
          'This QR code is not a valid CampusConnect event check-in code.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      // If JSON parsing fails, treat as general QR code
      Alert.alert(
        'QR Code Scanned',
        `Scanned data: ${data}`,
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
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false || !BarCodeScanner) {
    return (
      <QRScannerFallback 
        navigation={navigation} 
        onScan={handleBarCodeScanned}
      />
    );
  }

  return (
    <View style={styles.container}>
      {BarCodeScanner ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
          flashMode={flashMode ? 'torch' : 'off'}
        />
      ) : (
        <View style={[styles.scanner, styles.mockScanner]}>
          <Text style={styles.mockScannerText}>Camera Preview Not Available</Text>
        </View>
      )}
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={styles.overlayTop}>
          <Text style={styles.instructionText}>
            Position QR code within the frame to scan
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
        </View>
        
        {/* Bottom overlay with controls */}
        <View style={styles.overlayBottom}>
          <View style={styles.controls}>
            <CustomButton
              icon={flashMode ? "flash" : "flash-off"}
              onPress={toggleFlash}
              variant="outline"
              style={styles.controlButton}
            />
            
            {scanned && (
              <CustomButton
                title="Scan Again"
                onPress={resetScanner}
                style={styles.scanAgainButton}
              />
            )}
          </View>
          
          <Text style={styles.helpText}>
            Use this scanner to check in to events by scanning the QR code provided by event organizers.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scanner: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  permissionTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  permissionButton: {
    marginTop: theme.spacing.md,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
  instructionText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    fontWeight: '600',
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
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  controlButton: {
    marginHorizontal: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: theme.colors.textInverse,
  },
  scanAgainButton: {
    marginLeft: theme.spacing.lg,
  },
  helpText: {
    color: theme.colors.textInverse,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
    maxWidth: '80%',
  },
  mockScanner: {
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockScannerText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
  },
});

export default QRScannerScreen;
