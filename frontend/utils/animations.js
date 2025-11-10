import { Animated } from 'react-native';

/**
 * Animation Utilities for CampusConnect
 * Reusable animation functions for consistent app-wide animations
 */

/**
 * Staggered fade-in animation for list items
 * @param {Animated.Value} animatedValue - Animated value to animate
 * @param {number} index - Index of the item in the list
 * @param {number} delay - Delay between each item (default: 80ms)
 * @param {number} duration - Animation duration (default: 400ms)
 */
export const staggerFadeIn = (animatedValue, index, delay = 80, duration = 400) => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: duration,
    delay: index * delay,
    useNativeDriver: true,
  }).start();
};

/**
 * Slide up + fade in animation for list items
 * @param {Animated.Value} opacity - Opacity animated value
 * @param {Animated.Value} translateY - TranslateY animated value
 * @param {number} index - Index of the item in the list
 * @param {number} delay - Delay between each item (default: 80ms)
 */
export const staggerSlideUp = (opacity, translateY, index, delay = 80) => {
  Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay: index * delay,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      delay: index * delay,
      useNativeDriver: true,
    }),
  ]).start();
};

/**
 * Scale animation for button press
 * @param {Animated.Value} scale - Scale animated value
 * @param {number} targetScale - Target scale value (default: 0.95)
 * @param {number} duration - Animation duration (default: 100ms)
 */
export const buttonPressAnimation = (scale, targetScale = 0.95, duration = 100) => {
  Animated.sequence([
    Animated.timing(scale, {
      toValue: targetScale,
      duration: duration,
      useNativeDriver: true,
    }),
    Animated.timing(scale, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }),
  ]).start();
};

/**
 * Spring bounce animation
 * @param {Animated.Value} animatedValue - Animated value to animate
 * @param {number} toValue - Target value
 * @param {number} tension - Spring tension (default: 40)
 * @param {number} friction - Spring friction (default: 7)
 */
export const springBounce = (animatedValue, toValue = 1, tension = 40, friction = 7) => {
  Animated.spring(animatedValue, {
    toValue: toValue,
    tension: tension,
    friction: friction,
    useNativeDriver: true,
  }).start();
};

/**
 * Pulse animation (scale up and down continuously)
 * @param {Animated.Value} scale - Scale animated value
 * @param {number} minScale - Minimum scale (default: 1)
 * @param {number} maxScale - Maximum scale (default: 1.05)
 * @param {number} duration - Animation duration (default: 1000ms)
 */
export const pulseAnimation = (scale, minScale = 1, maxScale = 1.05, duration = 1000) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(scale, {
        toValue: maxScale,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: minScale,
        duration: duration,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

/**
 * Fade in animation
 * @param {Animated.Value} opacity - Opacity animated value
 * @param {number} duration - Animation duration (default: 300ms)
 * @param {number} delay - Delay before animation starts (default: 0ms)
 */
export const fadeIn = (opacity, duration = 300, delay = 0) => {
  Animated.timing(opacity, {
    toValue: 1,
    duration: duration,
    delay: delay,
    useNativeDriver: true,
  }).start();
};

/**
 * Fade out animation
 * @param {Animated.Value} opacity - Opacity animated value
 * @param {number} duration - Animation duration (default: 300ms)
 * @param {function} callback - Callback function after animation completes
 */
export const fadeOut = (opacity, duration = 300, callback) => {
  Animated.timing(opacity, {
    toValue: 0,
    duration: duration,
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Card press animation (scale + shadow effect)
 * Returns animated style object for card press
 * @param {Animated.Value} scale - Scale animated value
 * @param {Animated.Value} shadowOpacity - Shadow opacity animated value
 */
export const cardPressIn = (scale, shadowOpacity) => {
  Animated.parallel([
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(shadowOpacity, {
      toValue: 0.1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

export const cardPressOut = (scale, shadowOpacity) => {
  Animated.parallel([
    Animated.spring(scale, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }),
    Animated.timing(shadowOpacity, {
      toValue: 0.2,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};
