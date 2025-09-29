export interface UploadedImage {
  previewUrl: string; // The full data URL for <img> src
  base64: string;    // Just the base64 part for the API
  mimeType: string;  // e.g., 'image/jpeg'
}
