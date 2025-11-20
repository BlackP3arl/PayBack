import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { isNativePlatform } from './platform';

/**
 * Camera utilities for cross-platform image capture
 * Uses native camera on iOS/Android, file input on web
 */

export interface CapturedImage {
  path: string;
  data?: string; // Base64 on web
}

/**
 * Take a photo using device camera
 * Only available on native platforms
 */
export const takePhoto = async (): Promise<CapturedImage | null> => {
  if (!isNativePlatform()) {
    console.warn('Camera is not available on web platform');
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    return {
      path: image.webPath || image.path || '',
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

/**
 * Pick a photo from device gallery
 * Works on native platforms, falls back to file input on web
 */
export const pickPhoto = async (): Promise<CapturedImage | null> => {
  if (isNativePlatform()) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      return {
        path: image.webPath || image.path || '',
      };
    } catch (error) {
      console.error('Error picking photo:', error);
      return null;
    }
  } else {
    // Web fallback - return null, let component handle file input
    return null;
  }
};

/**
 * Save image file to app's documents directory (native only)
 */
export const saveImageToFilesystem = async (imagePath: string, fileName: string): Promise<string> => {
  if (!isNativePlatform()) {
    throw new Error('Filesystem operations are not available on web');
  }

  try {
    // Read the image data
    const imageData = await Filesystem.readFile({
      path: imagePath,
    });

    // Save to app directory
    const result = await Filesystem.writeFile({
      path: `receipts/${fileName}`,
      data: imageData.data,
      directory: Directory.Documents,
    });

    return result.uri;
  } catch (error) {
    console.error('Error saving image to filesystem:', error);
    throw error;
  }
};

/**
 * Convert file to base64 (web only)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get base64 from native image path (mobile only)
 */
export const getBase64FromPath = async (imagePath: string): Promise<string> => {
  if (!isNativePlatform()) {
    throw new Error('This operation is only available on native platforms');
  }

  try {
    const result = await Filesystem.readFile({
      path: imagePath,
    });

    return result.data as string;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};
