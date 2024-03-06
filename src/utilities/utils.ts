import { fromUnixTime } from 'date-fns';
import { Area } from 'react-easy-crop';
import Compressor from 'compressorjs';
import { ProfileDataType } from '../types/restaurant';
import { ContactType } from '../types/contact';
import vCard from './vcard';

export const updateObj = <T extends object, U extends object>(oldObj: T, updatedProps: U): T & U => ({
  ...oldObj,
  ...updatedProps,
});

export const cleanString = (str: string) => str.replace(/['",./\\;:<>?!@#$%&*()~|]/g, '');

// export const deepMerge = (target: any, source: any) => {
//   for (let key in source) {
//     if (source[key] instanceof Object && target.hasOwnProperty(key)) {
//       target[key] = deepMerge(target[key], source[key]);
//     } else if(source[key] !== null) {
//       target[key] = source[key];
//     }
//   }
//   return target;
// }

export const deepMerge = (target: any, source: any) => {
  for (let key in source) {
    if (source[key] instanceof Object && target.hasOwnProperty(key)) {
      target[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== null && target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

// export const deepMerge = (target: any, source: any) => {
//   // Create a new object to avoid side effects
//   const output = { ...target };

//   for (let key in source) {
//     if (source[key] !== null) {
//       if (source[key] instanceof Object) {
//         // Ensure target[key] is not null and is an object; otherwise, use an empty object
//         output[key] = deepMerge(output[key] && typeof output[key] === 'object' ? output[key] : {}, source[key]);
//       } else {
//         output[key] = source[key];
//       }
//     }
//   }

//   return output;
// };

// export const deepMergeWithReplacement = (target: any, source: any, keysToSkip: string[] = []) => {
//   const output = { ...target };

//   for (let key in source) {
//     if (keysToSkip.includes(key)) {
//       continue; // Skip merging this key
//     }

//     if (source[key] !== null) {
//       if (source[key] instanceof Object) {
//         if (Array.isArray(source[key])) {
//           // If it's an array, replace it entirely
//           output[key] = source[key];
//         } else {
//           // If it's an object, merge it recursively
//           output[key] = deepMergeWithReplacement(output[key] && typeof output[key] === 'object' ? output[key] : {}, source[key], keysToSkip);
//         }
//       } else {
//         // For primitive types, directly assign the value
//         output[key] = source[key];
//       }
//     } else if (source[key] === null && target[key] instanceof Object) {
//       // If the source is explicitly null and the target is an object, remove the key
//       delete output[key];
//     }
//   }

//   return output;
// };

export const isFirestoreTimestamp = (value: any): value is { seconds: number; nanoseconds: number } => {
  return value && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number';
}

export const convertFirestoreTimestampToDate = (timestamp: { seconds: number; nanoseconds: number }): Date => {
  // Convert seconds to milliseconds and add nanoseconds (converted to milliseconds)
  return fromUnixTime(timestamp.seconds + timestamp.nanoseconds / 1000000);
}

export const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export const getCroppedImg = async (
  imageSrc: string, 
  crop: Area, 
  desiredWidth?: number, 
  desiredHeight?: number
): Promise<string> => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx!.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx!.getImageData(0, 0, safeArea, safeArea);

  // Intermediate canvas for cropping
  const cropCanvas = document.createElement('canvas');
  const cropCtx = cropCanvas.getContext('2d');
  cropCanvas.width = crop.width;
  cropCanvas.height = crop.height;

  cropCtx!.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - crop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - crop.y)
  );

  // Resize only if desiredWidth and desiredHeight are provided
  if (desiredWidth && desiredHeight) {
    const resizeCanvas = document.createElement('canvas');
    resizeCanvas.width = desiredWidth;
    resizeCanvas.height = desiredHeight;
    const resizeCtx = resizeCanvas.getContext('2d')!;
    resizeCtx.drawImage(cropCanvas, 0, 0, desiredWidth, desiredHeight);

    return new Promise<string>((resolve, reject) => {
      resizeCanvas.toBlob(blob => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Canvas was unable to produce a blob.'));
        }
      }, 'image/webp');
    });
  }

  // If no resize dimensions provided, use cropped image as is
  return new Promise<string>((resolve, reject) => {
    cropCanvas.toBlob(blob => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      } else {
        reject(new Error('Canvas was unable to produce a blob.'));
      }
    }, 'image/webp');
  });
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
 
// export const getCroppedAndCompressedImg = async (
//   imageSrc: string, 
//   crop: Area, 
//   desiredWidth?: number, 
//   desiredHeight?: number
// ): Promise<{ croppedImageUrl: string, croppedBlob: Blob, base64: string }> => {
//   const croppedBlobUrl = await getCroppedImg(imageSrc, crop, desiredWidth, desiredHeight);
  
//   // Convert the croppedBlobUrl to a blob
//   const response = await fetch(croppedBlobUrl);
//   const croppedBlob = await response.blob();

//   // Compress the blob using compressorjs
//   const compressedBlob = await new Promise<Blob>((resolve, reject) => {
//     new Compressor(croppedBlob, {
//       quality: 0.8,  // you can adjust the compression quality here
//       success: resolve,
//       error: reject
//     });
//   });

//   // Convert compressed blob to base64 for Firestore
//   const compressedBase64Data = await blobToBase64(compressedBlob);
  
//   return {
//     croppedImageUrl: croppedBlobUrl,
//     croppedBlob: croppedBlob,
//     base64: compressedBase64Data,  // This is the compressed base64
//   };
// }

export const getCroppedAndCompressedImg = async (
  imageSrc: string, 
  crop: Area, 
  desiredWidth?: number, 
  desiredHeight?: number
): Promise<{ croppedImageUrl: string, croppedBlob: Blob, base64: string }> => {
  const croppedBlobUrl = await getCroppedImg(imageSrc, crop, desiredWidth, desiredHeight);
  
  const response = await fetch(croppedBlobUrl);
  const croppedBlob = await response.blob();

  const compressedBlob = await new Promise<Blob>((resolve, reject) => {
    new Compressor(croppedBlob, {
      quality: 0.8,  
      mimeType: 'image/jpeg',  // specify WebP format
      success: resolve,
      error: reject
    });
  });

  const compressedBase64Data = await blobToBase64(compressedBlob);

  return {
    croppedImageUrl: croppedBlobUrl,
    croppedBlob: croppedBlob,
    base64: compressedBase64Data,
  };
}

export const isValidVideoUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  const vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const facebookRegex = /^(https?\:\/\/)?(www\.)?facebook\.com.*$/;
  const soundcloudRegex = /^(https?\:\/\/)?(www\.)?soundcloud\.com.*$/;
  const streamableRegex = /^(https?\:\/\/)?(www\.)?streamable\.com.*$/;
  const twitchRegex = /^(https?\:\/\/)?(www\.twitch\.tv)\/.+$/;
  const dailymotionRegex = /^.+dailymotion\.com\/(video|hub)\/.+$/;
  const mixcloudRegex = /^(https?\:\/\/)?(www\.)?mixcloud\.com.*$/;

  return youtubeRegex.test(url) ||
         vimeoRegex.test(url) ||
         facebookRegex.test(url) ||
         soundcloudRegex.test(url) ||
         streamableRegex.test(url) ||
         twitchRegex.test(url) ||
         dailymotionRegex.test(url) ||
         mixcloudRegex.test(url)
};

export const replaceEmptyOrUndefinedWithNull = (obj: any): any => {
  for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        replaceEmptyOrUndefinedWithNull(obj[key]);
      } else {
          if (obj[key] === '' || obj[key] === undefined) {
              obj[key] = null;
          }
      }
  }
  return obj;
}

type DataToVCFType = ProfileDataType | ContactType;

export const createVCF = (
  profile: DataToVCFType,
  appDomain?: string | null,
  profileUrlSuffix?: string | null,
) => {
  const vcf = vCard();

  if ("basicInfoData" in profile) {
    // Handling for ProfileDataType
    const {
      firstName,
      lastName,
      email,
      organization,
      position,
      phone1,
      phone2,
      address,
    } = profile.basicInfoData!;

    vcf.firstName = firstName || '';
    vcf.lastName = lastName || '';
    vcf.workEmail = email || '';
    vcf.organization = organization || '';
    vcf.title = position || '';
    vcf.workPhone = phone1 || '';
    if (phone2) {
      vcf.cellPhone = phone2;
    }
    if (address) {
      vcf.workAddress.street = address;
    }

    if (profile.aboutData) {
      const { about, videoUrl } = profile.aboutData;
      vcf.note = about || '';
      if (videoUrl) {
        vcf.socialUrls['video'] = videoUrl;
      }
    }

    if (profile.profileImageData && profile.profileImageData.base64) {
      const cleanImage = `/9j/${profile.profileImageData.base64.split('/9j/').pop()}`;
      vcf.photo.embedFromString(cleanImage, 'JPEG');
    }

    if (profile.links) {
      const { social, custom } = profile.links;
    
      custom.filter(link => link.active).forEach(link => {
        vcf.socialUrls[link.title?.toLowerCase() || link.platform] = link.url;
      });
    
      social.filter(link => link.active).forEach(link => {
        vcf.socialUrls[link.platform] = link.url;
      });
    }

    if (appDomain && profileUrlSuffix) {
      const profileUrl = `${appDomain}/${profileUrlSuffix}`;
      vcf.socialUrls['profile'] = profileUrl;
    }
  } else if ("phone" in profile) {
    // Handling for ContactType
    vcf.firstName = profile.firstName || '';
    vcf.lastName = profile.lastName || '';
    vcf.workEmail = profile.email || '';
    vcf.workPhone = profile.phone || '';
  }

  return vcf.getFormattedString();
};

export const mapToStandardCSV = (contacts: ContactType[]) => {
  return contacts.map(contact => ({
    Name: `${contact.firstName} ${contact.lastName}`,
    'Given Name': contact.firstName,
    'First Name': contact.firstName,
    'Family Name': contact.lastName,
    'Last Name': contact.lastName,
    'E-mail 1 - Value': contact.email,
    'E-mail Address': contact.email,
    'Phone 2 - Value': contact.phone,
    'Business Phone': contact.phone,
    Notes: '',  // Not available in given contact structure
  }));
}

export const mapToFacebookCSV = (contacts: ContactType[]) => {
  return contacts.map(contact => ({
    email: contact.email,
    phone: contact.phone,
    fn: contact.firstName,
    ln: contact.lastName,
    country: '',  // Not available in given contact structure
  }));
}

export const mapToMailchimpCSV = (contacts: ContactType[]) => {
  return contacts.map(contact => ({
    'Email Address': contact.email,
    'First Name': contact.firstName,
    'Last Name': contact.lastName,
    Tags: '',  // Not available in given contact structure
    Phone: contact.phone,
  }));
}

export const mapToSalesforceCSV = (contacts: ContactType[]) => {
  return contacts.map(contact => ({
    Email: contact.email,
    'First Name': contact.firstName,
    'Last Name': contact.lastName,
    Phone: contact.phone,
    Mobile: contact.phone,  // Assuming same as phone for now
  }));
}

export const mapToHubspotCSV = (contacts: ContactType[]) => {
  return contacts.map(contact => ({
    'First Name': contact.firstName,
    'Last Name': contact.lastName,
    'Email Address': contact.email,
    'Phone Number': contact.phone,
  }));
}

export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages = {
    // Common Email/Password authentication errors
    'auth/invalid-email': "Invalid email format.",
    'auth/user-disabled': "This account has been disabled. Please contact support.",
    'auth/user-not-found': "No user found with this email address.",
    'auth/wrong-password': "Incorrect password. Please try again.",
    'auth/email-already-in-use': "The email address is already in use by another account.",
    'auth/operation-not-allowed': "Email/password accounts are not enabled. Please contact support.",
    'auth/too-many-requests': "Too many unsuccessful login attempts. Please try again later.",

    // Google authentication errors
    'auth/popup-blocked': "The popup was blocked by the browser. Please allow popups for this website and try again.",
    'auth/popup-closed-by-user': "The popup was closed before authentication could be completed. Please try again.",
    'auth/auth-domain-config-required': "Login configuration error. Please contact support.",
    'auth/cancelled-popup-request': "Another popup request was made before the previous one was finished. Please try again.",
    'auth/unauthorized-domain': "The domain of this app is not authorized for OAuth operations. Please contact support.",
    'auth/account-exists-with-different-credential': "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
    'auth/credential-already-in-use': "This credential is already associated with a different user account.",
    'auth/operation-not-supported-in-this-environment': "This operation is not supported in the environment this application is running on. Try using a different authentication method or contact support.",
    'auth/timeout': "The operation has timed out. Please try again.",

    // General error
    'auth/internal-error': "An unexpected error occurred. Please try again.",
  };

  return errorMessages[errorCode as keyof typeof errorMessages] || "An unexpected error occurred. Please try again.";
}

export const truncateString = (str: string, length: number = 50) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
}


// export const createVCF = (profile: ProfileDataType, appDomain: string, profileUrlSuffix: string) => {
//     const vcf = vCardsJS();

//     if (profile.basicInfoData) {
//         const {
//             firstName,
//             lastName,
//             email,
//             organization,
//             position,
//             phone1,
//             phone2,
//             address,
//         } = profile.basicInfoData;

//         vcf.firstName = firstName || '';
//         vcf.lastName = lastName || '';
//         vcf.email = email || '';
//         vcf.organization = organization || '';
//         vcf.title = position || '';
//         vcf.workPhone = phone1 || '';
//         if (phone2) {
//             vcf.cellPhone = phone2;
//         }
//         if (address) {
//             vcf.workAddress.street = address;
//         }
//     }

//     if (profile.aboutData) {
//         const { about, videoUrl } = profile.aboutData;
//         vcf.note = about || '';
//         if (videoUrl) {
//             vcf.socialUrls['video'] = videoUrl;
//         }
//     }

//     // if (profile.coverImageData.url) {
//     //     vcf.photo.attachFromUrl(profile.coverImageData.url, 'JPEG');
//     // }
//     // if (profile.profileImageData.base64) {
//     //     vcf.logo.embedFromString(profile.profileImageData.base64, 'JPEG');
//     // }

//     const { social, custom } = profile.links;

//     custom.forEach(link => {
//         vcf.socialUrls[link.title?.toLowerCase() || link.platform] = link.url;
//     });

//     social.forEach(link => {
//         vcf.socialUrls[link.platform] = link.url;
//     });

//     const profileUrl = `${appDomain}/${profileUrlSuffix}`;
//     vcf.socialUrls['profile'] = profileUrl;

//     return vcf.getFormattedString();
// }


