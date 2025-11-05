import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import theme from '../utils/theme';

const QRScannerFallback = ({ navigation, onScan }) => {
  const [manualInput, setManualInput] = React.useState('');

  const handleManualScan = () => {
    if (!manualInput.trim()) {
      Alert.alert('Error', 'Please enter some QR code data');
      return;
    }

    try {
      // Try to parse as JSON first
      const qrData = JSON.parse(manualInput);
      if (onScan) {
        onScan({ type: 'manual', data: manualInput });
      }
    } catch (error) {
      // If not JSON, treat as plain text
      if (onScan) {
        onScan({ type: 'manual', data: manualInput });
      }
    }
  };

  const simulateEventScan = () => {
    const mockEventData = JSON.stringify({
      type: 'event_checkin',
      eventId: '1',
      eventTitle: 'Tech Conference 2024'
    });
    
    if (onScan) {
      onScan({ type: 'manual', data: mockEventData });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mockCamera}>
        <Ionicons name="qr-code-outline" size={100} color={theme.colors.textLight} />
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.subtitle}>
          Camera not available in this environment
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Manual QR Code Input:</Text>
        <TextInput
          style={styles.textInput}
          value={manualInput}
          onChangeText={setManualInput}
          placeholder="Enter QR code data manually"
          placeholderTextColor={theme.colors.textLight}
          multiline
        />
        
        <CustomButton
          title="Process QR Data"
          onPress={handleManualScan}
          style={styles.button}
        />
        
        <CustomButton
          title="Simulate Event Check-in"
          onPress={simulateEventScan}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  mockCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  inputSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.md,
  },
  button: {
    marginBottom: theme.spacing.sm,
  },
});

export default QRScannerFallback;
