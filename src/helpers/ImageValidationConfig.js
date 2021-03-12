export const minimumFileSizeInKB = (10) * (1024); // in KB - 10KB
export const maximumFileSizeInMB = (5) * (1024 * 1024); // in MB - 5MB

export const allowedMimeTypes = ['image/jpeg', 'image/png'];
export const acceptedImageExtensions = allowedMimeTypes.map((mimeType) => mimeType.split("/")[1]); // extract image extensions from mime-types

export const maxSizeExceededError = `Image is too large! Maximum file size is ${maximumFileSizeInMB / (1024 * 1024)}MB.`;
export const minSizeExceededError = `Image is too small! Minimum file size is ${minimumFileSizeInKB / (1024)}KB.`;
export const notAllowedMimeTypeError = `This file type is not allowed. Must be one of: ${acceptedImageExtensions}.`;