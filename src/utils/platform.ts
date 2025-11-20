import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utilities for handling platform-specific features
 * Allows graceful degradation from mobile to web
 */

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

export const isMobile = (): boolean => {
  return isIOS() || isAndroid();
};

export const getPlatform = (): string => {
  return Capacitor.getPlatform();
};

/**
 * Check if a specific native feature is available
 */
export const canAccessCamera = (): boolean => {
  return isNativePlatform() || isWeb();
};

export const canAccessContacts = (): boolean => {
  return isNativePlatform();
};

export const canAccessFilesystem = (): boolean => {
  return isNativePlatform();
};

/**
 * Get platform-specific configuration
 */
export const getPlatformConfig = () => {
  return {
    platform: getPlatform(),
    isNative: isNativePlatform(),
    isWeb: isWeb(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
    capabilities: {
      camera: canAccessCamera(),
      contacts: canAccessContacts(),
      filesystem: canAccessFilesystem(),
    },
  };
};
