import { withTiming, withSpring, withSequence, withDelay, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

// Standard animation configs for consistency
export const animationConfig = {
  fast: { duration: 150 } as WithTimingConfig,
  normal: { duration: 250 } as WithTimingConfig,
  slow: { duration: 400 } as WithTimingConfig,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  } as WithSpringConfig,
  springBouncy: {
    damping: 10,
    stiffness: 100,
    mass: 0.8,
  } as WithSpringConfig,
};

// Common animation patterns
export const animations = {
  // Scale press animation
  pressScale: (pressed: boolean) => 
    withTiming(pressed ? 0.95 : 1, animationConfig.fast),
  
  // Fade in/out
  fadeIn: (delay = 0) => 
    withDelay(delay, withTiming(1, animationConfig.normal)),
  fadeOut: () => 
    withTiming(0, animationConfig.fast),
  
  // Slide animations
  slideInRight: (delay = 0) => 
    withDelay(delay, withSpring(0, animationConfig.spring)),
  slideInLeft: (delay = 0) => 
    withDelay(delay, withSpring(0, animationConfig.spring)),
  slideInUp: (delay = 0) => 
    withDelay(delay, withSpring(0, animationConfig.spring)),
  slideInDown: (delay = 0) => 
    withDelay(delay, withSpring(0, animationConfig.spring)),
  
  // Bounce animation
  bounce: () => 
    withSequence(
      withSpring(1.1, animationConfig.springBouncy),
      withSpring(1, animationConfig.spring)
    ),
  
  // Shake animation
  shake: () => 
    withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    ),
  
  // Pulse animation
  pulse: () => 
    withSequence(
      withTiming(1.05, { duration: 300 }),
      withTiming(1, { duration: 300 })
    ),
};

// Stagger animation helper
export const staggerDelay = (index: number, baseDelay = 50) => index * baseDelay;
