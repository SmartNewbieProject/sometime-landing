import { Easing } from "framer-motion";

export const bubbleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const floatVariants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
  },
};

export const arrowRightVariants = {
  animate: {
    x: [0, 3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
  },
};

export const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeInOut" as Easing },
  },
};

export const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" as Easing },
  }),
};

export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeInOut" as Easing },
  },
};

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeInOut" as Easing },
  },
};
