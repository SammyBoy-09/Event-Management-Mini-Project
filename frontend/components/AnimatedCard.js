import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { staggerSlideUp, cardPressIn, cardPressOut } from '../utils/animations';

/**
 * AnimatedCard Component
 * Wrapper component for cards with staggered animation and press effects
 * @param {number} index - Index of the card in the list
 * @param {number} delay - Delay between animations (default: 80ms)
 * @param {function} onPress - Press handler
 * @param {object} style - Additional styles
 * @param {ReactNode} children - Card content
 */
const AnimatedCard = ({ 
  index = 0, 
  delay = 80, 
  onPress, 
  style, 
  children,
  disabled = false,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // Stagger animation on mount
    staggerSlideUp(opacity, translateY, index, delay);
  }, [index]);

  const handlePressIn = () => {
    if (!disabled) {
      cardPressIn(scale, shadowOpacity);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      cardPressOut(scale, shadowOpacity);
    }
  };

  const animatedStyle = {
    opacity,
    transform: [
      { translateY },
      { scale },
    ],
  };

  if (onPress && !disabled) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;
