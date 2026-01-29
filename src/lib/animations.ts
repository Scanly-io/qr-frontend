/**
 * Framer Motion Animation Presets
 * Reusable animation configurations for consistent motion design
 */

import type { Variants, Transition } from 'framer-motion';
import { easing } from './design-tokens';

// ═══════════════════════════════════════════════════════════
// SPRING PHYSICS (Professional bouncy animations)
// ═══════════════════════════════════════════════════════════

export const springs = {
  // Soft spring (gentle bounce)
  soft: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
  },
  
  // Default spring (balanced)
  default: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 17,
  },
  
  // Snappy spring (quick response)
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 25,
  },
  
  // Bouncy spring (playful)
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 10,
  },
} as const;

// ═══════════════════════════════════════════════════════════
// FADE ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: easing.easeOut },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easing.easeOut },
  },
};

export const fadeInDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easing.easeOut },
  },
};

// ═══════════════════════════════════════════════════════════
// SCALE ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { ...springs.snappy },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const scaleBounceVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { ...springs.bouncy },
  },
};

// ═══════════════════════════════════════════════════════════
// SLIDE ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const slideInLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

// ═══════════════════════════════════════════════════════════
// STAGGER ANIMATIONS (Sequential reveals)
// ═══════════════════════════════════════════════════════════

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easing.easeOut },
  },
};

// Custom stagger with index support
export const createStaggerVariant = (delayPerItem = 0.1) => ({
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * delayPerItem,
      duration: 0.5,
      ease: easing.easeOut,
    },
  }),
});

// ═══════════════════════════════════════════════════════════
// BUTTON HOVER/TAP ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const buttonHover = {
  scale: 1.05,
  y: -2,
  transition: { ...springs.default },
};

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

export const buttonGlowHover = {
  scale: 1.02,
  y: -2,
  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
  transition: { ...springs.default },
};

// ═══════════════════════════════════════════════════════════
// CARD HOVER ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const cardHover = {
  y: -4,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  transition: { ...springs.default },
};

export const cardLiftHover = {
  y: -8,
  scale: 1.02,
  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.18)',
  transition: { ...springs.snappy },
};

// ═══════════════════════════════════════════════════════════
// ICON ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const iconScaleHover = {
  scale: 1.1,
  transition: { ...springs.default },
};

export const iconRotateHover = {
  scale: 1.1,
  rotate: 6,
  transition: { ...springs.bouncy },
};

export const iconSpinHover = {
  rotate: 360,
  transition: { duration: 0.5, ease: 'linear' },
};

// ═══════════════════════════════════════════════════════════
// GLOW PULSE ANIMATION
// ═══════════════════════════════════════════════════════════

export const glowPulseVariants: Variants = {
  initial: { 
    opacity: 0.5,
  },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════
// MODAL/DIALOG ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
};

export const modalContentVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      ...springs.snappy,
      delay: 0.1,
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 },
  },
};

// ═══════════════════════════════════════════════════════════
// SHAKE ANIMATION (Error feedback)
// ═══════════════════════════════════════════════════════════

export const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
    ease: 'easeInOut',
  },
};

// ═══════════════════════════════════════════════════════════
// LOADING ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ═══════════════════════════════════════════════════════════
// PAGE TRANSITION ANIMATIONS
// ═══════════════════════════════════════════════════════════

export const pageTransitionVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easing.easeOut,
    },
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: easing.easeIn,
    },
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Create a custom transition
 */
export const createTransition = (
  durationMs: number,
  easingCurve: readonly number[] = easing.easeOut
): Transition => ({
  duration: durationMs / 1000,
  ease: easingCurve as [number, number, number, number],
});

/**
 * Create a spring transition with custom values
 */
export const createSpring = (
  stiffness = 400,
  damping = 17
): Transition => ({
  type: 'spring',
  stiffness,
  damping,
});

/**
 * Delay an animation
 */
export const withDelay = (
  variant: Variants,
  delayMs: number
): Variants => {
  const delayed = { ...variant };
  if (delayed.visible && typeof delayed.visible === 'object' && 'transition' in delayed.visible) {
    const visibleConfig = delayed.visible as { transition?: Transition };
    delayed.visible = {
      ...delayed.visible,
      transition: {
        ...visibleConfig.transition,
        delay: delayMs / 1000,
      },
    };
  }
  return delayed;
};

// ═══════════════════════════════════════════════════════════
// EXPORT ALL PRESETS
// ═══════════════════════════════════════════════════════════

export const animations = {
  springs,
  fadeVariants,
  fadeInUpVariants,
  fadeInDownVariants,
  scaleVariants,
  scaleBounceVariants,
  slideInLeftVariants,
  slideInRightVariants,
  staggerContainer,
  staggerItem,
  createStaggerVariant,
  buttonHover,
  buttonTap,
  buttonGlowHover,
  cardHover,
  cardLiftHover,
  iconScaleHover,
  iconRotateHover,
  iconSpinHover,
  glowPulseVariants,
  modalBackdropVariants,
  modalContentVariants,
  shakeAnimation,
  spinAnimation,
  pulseAnimation,
  pageTransitionVariants,
  createTransition,
  createSpring,
  withDelay,
} as const;

export default animations;
