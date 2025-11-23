import { isNativePlatform } from './platform';

/**
 * Contact utilities for cross-platform contact selection
 * Uses native contacts on iOS/Android, manual input on web
 */

export interface ContactInfo {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
}

/**
 * Request permission to access contacts
 * Only relevant on native platforms
 */
export const requestContactsPermission = async (): Promise<boolean> => {
  if (!isNativePlatform()) {
    return true; // Web doesn't need permission
  }

  try {
    // TODO: Implement actual contacts permission request
    // const permission = await ContactsPlugin.requestPermissions();
    // return permission.contacts === 'granted';
    console.log('Contacts permission requested (stub for development)');
    return true;
  } catch (error) {
    console.error('Error requesting contacts permission:', error);
    return false;
  }
};

/**
 * Open native contact picker
 * Only available on iOS and Android
 */
export const pickContact = async (): Promise<ContactInfo | null> => {
  if (!isNativePlatform()) {
    console.warn('Contact picker is not available on web platform');
    return null;
  }

  try {
    // TODO: Implement actual contact picker
    // const result = await ContactsPlugin.getContact();
    console.log('Contact picker invoked (stub for development)');
    return null;
  } catch (error) {
    console.error('Error picking contact:', error);
    return null;
  }
};

/**
 * Get all contacts
 * Only available on native platforms
 */
export const getAllContacts = async (): Promise<ContactInfo[]> => {
  if (!isNativePlatform()) {
    return [];
  }

  try {
    // TODO: Implement actual contacts retrieval
    // const result = await ContactsPlugin.getContacts();
    console.log('Getting all contacts (stub for development)');
    return [];
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
};

/**
 * Check if contacts are accessible
 */
export const canAccessContacts = (): boolean => {
  return isNativePlatform();
};
