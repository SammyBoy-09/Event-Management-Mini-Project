import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * Loading Spinner Component
 * Displays a full-screen loading indicator
 */
const LoadingSpinner = ({ size = 'large', color = COLORS.primary }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default LoadingSpinner;
