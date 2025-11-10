import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { staggerFadeIn } from '../utils/animations';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

/**
 * AnimatedTag Component
 * Individual tag with fade-in animation
 */
const AnimatedTag = ({ tag, index, delay = 60 }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    staggerFadeIn(opacity, index, delay, 300);
  }, [index]);

  return (
    <Animated.View style={[styles.tag, { opacity }]}>
      <Text style={styles.tagText}>{tag}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 6,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS.PRIMARY + '15',
    marginRight: SPACING.XS,
    marginBottom: SPACING.XS,
  },
  tagText: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
});

export default AnimatedTag;
