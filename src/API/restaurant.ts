import { firestore, storage } from './firebaseConfig';
import {
  writeBatch, doc, setDoc, updateDoc, getDoc, collection, where, getDocs, query, addDoc, arrayUnion, deleteDoc,
  increment, onSnapshot, DocumentReference, DocumentSnapshot, DocumentData, QuerySnapshot,
} from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from '@firebase/storage';
import isEqual from 'lodash/isEqual';
import {
  RestaurantDataType,
  BasicInfoFormDataTypes,
  AboutFormDataTypes,
  ThemeSettingsType,
  ColorType,
  LinkType,
  CreateRestaurantResponseType,
} from '../types/restaurant';
import {
  MenuType,
  MenuSectionType,
  MenuItemType
} from '../types/menu';

export const uploadImageToStorage = async (userId: string, folderName: string, imageName: string, blobData: Blob) => {
  try {
    const imageRef = ref(storage, `users/${userId}/${folderName}/${imageName}`);
    await uploadBytes(imageRef, blobData);
    const downloadURL = await getDownloadURL(imageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const createRestaurant = async (userId: string, restaurantData: RestaurantDataType): Promise<CreateRestaurantResponseType> => {
  const userRef = doc(firestore, 'users', userId);
  const restaurantsCollectionRef = collection(userRef, 'restaurants');
  console.log(restaurantData);
  
  // Start a batch write
  const batch = writeBatch(firestore);

  // Create the main profile document with initial data
  const newRestaurantRef = doc(restaurantsCollectionRef);
  const newRestaurantId = newRestaurantRef.id;

  let coverImageResponse: { success: boolean, url?: string | null } = { success: false };
  let profileImageResponse: { success: boolean, url?: string | null } = { success: false };

  if (restaurantData.coverImageData && restaurantData.coverImageData.blob) {
    coverImageResponse = await uploadImageToStorage(userId, 'cover', `${newRestaurantId}.webp`, restaurantData.coverImageData.blob);
    if (!coverImageResponse.success) return coverImageResponse;
  }

  if (restaurantData.profileImageData && restaurantData.profileImageData.blob) {
    profileImageResponse = await uploadImageToStorage(userId, 'profile', `${newRestaurantId}.webp`, restaurantData.profileImageData.blob);
    if (!profileImageResponse.success) return profileImageResponse;
  }

  const combinedData = {
    title: restaurantData.title || 'default',
    basicInfoData: restaurantData.basicInfoData || null,
    aboutData: restaurantData.aboutData || null,
    coverImageData: {
      url: coverImageResponse.url || null,
    },
    profileImageData: {
      url: profileImageResponse.url || null,
    },
    contactFormData: restaurantData.contactFormData || null,
    themeSettings: restaurantData.themeSettings,
    favoriteColors: restaurantData.favoriteColors && restaurantData.favoriteColors.length > 0 ? restaurantData.favoriteColors : null,
    createdOn: restaurantData.createdOn,
  };

  // Set the initial profile data in the batch
  batch.set(newRestaurantRef, combinedData);

  // Save compressed profile image data to profileImage subcollection under profile
  const compressedImageData = { base64: restaurantData.profileImageData && restaurantData.profileImageData.base64 ? restaurantData.profileImageData.base64 : null };
  const profileImageCollectionRef = collection(newRestaurantRef, 'profileImage');
  await addDoc(profileImageCollectionRef, compressedImageData);

  // Save links to links subcollection under profile
  if (restaurantData.links) {
    const linksCollectionRef = collection(newRestaurantRef, 'links');
    for (const link of [...restaurantData.links.social, ...restaurantData.links.custom]) {
      await addDoc(linksCollectionRef, link);
    }
  }
  
  // Commit the batch write
  try {
    await batch.commit();

    // After a successful batch write, continue with any operations that need to be done outside of the batch
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    const profilesCount = (userData?.profileList?.length || 0) + 1;
    const restaurantTitle = (profilesCount === 1 && restaurantData.basicInfoData && !restaurantData.basicInfoData.title)
      ? 'default'
      : (restaurantData.title || `profile${profilesCount}`);

    // Update the user document with activeProfileId and add the new profile to profileList
    await updateDoc(userRef, {
      activeRestaurantId: newRestaurantId,
      restaurantList: arrayUnion({
        restaurantTitle: restaurantTitle,
        restaurantId: newRestaurantId
      })
    });

    return { success: true, restaurant: { id: newRestaurantId, title: restaurantTitle, data: combinedData } };
  } catch (error) {
    console.log(error);
    
    console.error("Error saving profile:", error);
    return { success: false, error: (error as Error).message };
  }
};

function processRestaurantData(restaurantSnapshot: DocumentSnapshot, userId: string) {
  const restaurantData = restaurantSnapshot.data();
  if (restaurantData) {
    restaurantData.userId = userId;
  }
  return restaurantData;
}

// export const fetchLinksSubcollection = async (profileRef: DocumentReference, type: string) => {
export const fetchLinksSubcollection = async (userId: string, restaurantId: string, type: string) => {
  const profileRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);
  const linksRef = collection(profileRef, 'links');
  const linksQuery = query(linksRef, where('is' + type.charAt(0).toUpperCase() + type.slice(1), '==', true));
  
  try {
    // Implementing a timeout for the Firestore query
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), 20000)); // 5 seconds timeout
    const linksSnapshot = await Promise.race([getDocs(linksQuery), timeout]) as QuerySnapshot;

    return linksSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() as LinkType })) // Make sure to cast to your LinkType
      .sort((a, b) => a.position - b.position); // Assuming 'position' is a numeric field
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching links:', error.message);
      if (error.message === "Query timeout") {
        console.error('Query timed out');
      }
      // Additional error handling logic here
    } else {
      // Handle cases where error is not an instance of Error
      console.error('An unknown error occurred:', error);
    }
    // Consider re-throwing the error or returning a specific error object
    throw error;
  }
}

export const fetchProfileImageSubcollection = async (userId: string, profileId: string) => {
  const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);
  const profileImageRef = collection(profileRef, 'profileImage');

  try {
    // Implementing a timeout for the Firestore query
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), 20000));
    const profileImageSnapshot = await Promise.race([getDocs(profileImageRef), timeout]) as QuerySnapshot;

    if (!profileImageSnapshot.empty) {
      const imageData = profileImageSnapshot.docs[0].data();
      return imageData;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    
    if (error instanceof Error) {
      console.error('Error fetching profile image:', error.message);
      if (error.message === "Query timeout") {
        console.error('Query timed out');
      }
      // Additional error handling logic here
    } else {
      // Handle cases where error is not an instance of Error
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
}

export const fetchRestaurantById = (userId: string, restaurantId: string) => {
  return new Promise<{ success: boolean, data?: any, error?: string }>((mainResolve, mainReject) => {
    const restaurantRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);
    
    // First, attempt to get the profile using onSnapshot
    const unsubscribeRestaurant = onSnapshot(restaurantRef, async (restaurantSnapshot) => {
      if (restaurantSnapshot.exists()) {
        let restaurantData = processRestaurantData(restaurantSnapshot, userId);
        restaurantData = { ...restaurantData, id: restaurantId };  
        console.log('restaurant fetching resolved from server')    
        mainResolve({ success: true, data: restaurantData });
      } else if (restaurantSnapshot.metadata.fromCache) {
        // If data is from cache and doesn't exist, try fetching from server
        try {
          const serverRestaurantSnapshot = await getDoc(restaurantRef);
          if (serverRestaurantSnapshot.exists()) {
            let restaurantData = processRestaurantData(serverRestaurantSnapshot, userId);
            restaurantData = { ...restaurantData, id: restaurantId };
            console.log('restaurant fetching resolved')
            mainResolve({ success: true, data: restaurantData });
          } else {
            mainReject({ success: false, error: 'Restaurant not found.' });
          }
        } catch (error) {
          console.error("Error fetching restaurant from server:", error);
          mainReject({ success: false, error: (error as Error).message });
        }
      } else {
        mainReject({ success: false, error: 'Restaurant not found.' });
      }
    }, error => {
      console.error("Error fetching restaurant:", error);
      mainReject({ success: false, error: error.message });
    });
    
    // Return a function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribeRestaurant();
  });
};

export const updateRestaurantBasicInfo = (
  userId: string, 
  restaurantId: string, 
  basicInfoData: BasicInfoFormDataTypes
): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve, reject) => {
    const profileRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);

    updateDoc(profileRef, { basicInfoData }) // Ensure the field name matches your Firestore document structure
      .then(() => {
        // Successfully updated the document
        console.log('success')
        resolve({ success: true });
      })
      .catch(error => {
        // Error during the update
        console.error("Error updating basic info:", error);
        reject({ success: false, error: error.message });
      });
  });
};

export const updateRestaurantAboutInfo = (userId: string, restaurantId: string, aboutData: AboutFormDataTypes) => {
  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const profileRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);

    updateDoc(profileRef, { aboutData })
      .then(() => {
        resolve({ success: true });
      })
      .catch(error => {
        console.error("Error updating about info:", error);
        reject({ success: false, error: error.message });
      });
  });
};

interface ThemeUpdateResponse {
  success: boolean;
  error?: string;
}

export const updateThemeSettings = (userId: string, restaurantId: string, themeSettings: ThemeSettingsType, favoriteColors: ColorType[]) => {
  return new Promise<ThemeUpdateResponse>((resolve, reject) => {
    const restaurantRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);

    updateDoc(restaurantRef, { themeSettings, favoriteColors })
      .then(() => {
        // Successfully updated the document
        resolve({ success: true });
      })
      .catch(error => {
        // Error during the update
        console.error("Error updating theme settings:", error);
        reject({ success: false, error: error.message });
      });
  });
};

export const updateRestaurantCoverImage = async (
  userId: string,
  restaurantId: string,
  newCoverImageData: { url: string | null, blob: Blob, base64: string }
) => {
  try {
    const profileRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);
    let coverImageResponse: { success: boolean, url?: string | null } = { success: false };

    // If there is a new image to upload
    if (newCoverImageData.blob && newCoverImageData.blob.size > 0) {
      coverImageResponse = await uploadImageToStorage(userId, 'cover', `${restaurantId}.webp`, newCoverImageData.blob);
      if (!coverImageResponse.success) return coverImageResponse;
    } else {
      // If the image is being removed
      coverImageResponse = { success: true, url: null };
    }

    // Update the URLs in the profile document
    await updateDoc(profileRef, {
      coverImageData: {
        url: coverImageResponse.url,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating cover image:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateRestaurantProfileImage = async (
  userId: string,
  restaurantId: string,
  newProfileImageData: { url: string | null, blob: Blob, base64: string },
) => {
  try {
    const profileRef = doc(firestore, 'users', userId, 'restaurants', restaurantId);

    let profileImageResponse: { success: boolean, url?: string | null } = { success: false };

    // Upload new profile image to storage
    if (newProfileImageData.blob && newProfileImageData.blob.size > 0) {
      profileImageResponse = await uploadImageToStorage(userId, 'profile', `${restaurantId}.webp`, newProfileImageData.blob);
      if (!profileImageResponse.success) return profileImageResponse;
    } else {
      profileImageResponse = { success: true, url: null };
    }

    // Update the URLs in the profile document
    await updateDoc(profileRef, {
      profileImageData: {
        url: profileImageResponse.url,
      }
    });

    // Update base64 data in profileImage subcollection under profile
    // const profileImageCollectionRef = collection(profileRef, 'profileImage');
    // const profileImageSnapshot = await getDocs(profileImageCollectionRef);

    // if (!profileImageSnapshot.empty) {
    //   const profileImageDocRef = doc(profileImageCollectionRef, profileImageSnapshot.docs[0].id);
    //   await updateDoc(profileImageDocRef, { base64: newProfileImageData.base64 });
    // }

    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateLinks = async (userId: string, profileId: string, newLinks: any) => {
  const linksCollectionRef = collection(doc(firestore, 'users', userId, 'restaurants', profileId), 'links');

  // Fetch current links from Firestore
  const currentLinksSnapshot = await getDocs(linksCollectionRef);
  const currentLinks: any[] = [];
  currentLinksSnapshot.forEach(doc => {
    currentLinks.push({
      id: doc.id,
      ...doc.data()
    });
  });

  const tasks: Promise<any>[] = [];

  // Determine links to be added, updated, or deleted
  const newLinksFlat = [...newLinks.social, ...newLinks.custom];

  for (const link of newLinksFlat) {
    // If no id, it's a new link
    if (!link.id) {
      tasks.push(addDoc(linksCollectionRef, link));
    } else {
      const currentLinkData = currentLinks.find(l => l.id === link.id);
      if (currentLinkData) {
        // Compare data and update if necessary
        if (!isEqual(currentLinkData, link)) {
          const linkRef = doc(linksCollectionRef, link.id);
          tasks.push(updateDoc(linkRef, link));
        }
      }
    }
  }

  // Check for links to delete
  for (const currentLink of currentLinks) {
    if (!newLinksFlat.some(link => link.id === currentLink.id)) {
      tasks.push(deleteDoc(doc(linksCollectionRef, currentLink.id)));
    }
  }

  // Wait for all tasks to complete
  await Promise.all(tasks).catch(error => {
    console.error("Error updating links:", error);
    return { success: false, error: error.message };
  });

  return { success: true };
};


export const logRestaurantVisit = async (userId: string, profileId: string) => {
  try {
    const visitDetails = {
      visitedOn: new Date(),
      userId: userId, 
      profileId: profileId,
    };

    // Add the visit to the 'visits' collection. This will trigger the Cloud Function incrementVisitCounts.
    const visitsRef = collection(firestore, 'users', userId, 'profiles', profileId, 'visits');
    await addDoc(visitsRef, visitDetails);

    return { success: true };
  } catch (error) {
    console.error("Error logging visit:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const incrementLinkClickCount = async (userId: string, profileId: string, linkId: string) => {  
  try {
    const linkRef = doc(firestore, 'users', userId, 'profiles', profileId, 'links', linkId);
    
    await setDoc(linkRef, {
      clicked: increment(1)
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error incrementing link click count:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const incrementTeamLinkClickCount = async (userId: string, teamId: string, linkId: string) => {  
  try {
    // Increment team-wide link click count
    const teamLinkRef = doc(firestore, 'teams', teamId, 'links', linkId);
    await setDoc(teamLinkRef, { clicked: increment(1) }, { merge: true });

    // Check if the link already exists in the user's linkClicks subcollection
    const memberLinkClickRef = doc(firestore, 'users', userId, 'linkClicks', linkId);
    const memberLinkDoc = await getDoc(memberLinkClickRef);

    // If it exists, increment the count. If not, create it with a count of 1
    if (memberLinkDoc.exists()) {
      await setDoc(memberLinkClickRef, { clicked: increment(1) }, { merge: true });
    } else {
      await setDoc(memberLinkClickRef, { clicked: 1 }, { merge: true });
    }

    return { success: true };
  } catch (error) {
    console.error("Error incrementing link click count:", error);
    return { success: false, error: (error as Error).message };
  }
};


export const incrementAddedToContacts = async (userId: string, profileId: string) => {
  try {
    const profileRef = doc(firestore, 'users', userId, 'profiles', profileId);

    await setDoc(profileRef, {
      addedToContacts: increment(1)
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error incrementing addedToContacts count:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const getVisitsForLast30Days = async (userId: string, profileId: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const visitsRef = collection(firestore, `users/${userId}/profiles/${profileId}/visits`);

  const q = query(visitsRef, 
    where('visitedOn', '>=', startDate),
    where('visitedOn', '<=', endDate)
  );

  const querySnapshot = await getDocs(q);
  
  const visitsData = querySnapshot.docs.map(doc => doc.data());
  
  return visitsData;
};

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LinkClickType {
  id?: string;          
  clicked: number;    
  linkTitle?: string;
  linkUrl?: string;
}

export const getMemberLinkClicks = (userId: string): Promise<APIResponse<LinkClickType[]>> => {
  return new Promise<APIResponse<LinkClickType[]>>((resolve, reject) => {
    const linkClicksCollectionRef = collection(firestore, `users/${userId}/linkClicks`);
    const linkClicksQuery = query(linkClicksCollectionRef);

    const unsubscribe = onSnapshot(linkClicksQuery, linkClicksSnapshot => {
      const linkClicks: LinkClickType[] = [];

      if (linkClicksSnapshot.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }

      if (linkClicksSnapshot.empty) {
        resolve({ success: true, data: [] });
      } else {
        linkClicksSnapshot.forEach(doc => {
          const linkClick = doc.data() as LinkClickType;
          linkClicks.push({ ...linkClick, id: doc.id });
        });

        resolve({ success: true, data: linkClicks });
      }

      unsubscribe();  // Stop listening after handling the initial snapshot.
      
    }, error => {
      console.error("Snapshot error:", error);
      reject({ success: false, data: [], error: error.message });
      unsubscribe();  // Stop listening if there's an error.
    });
  });
};

/**
 * Fetches all menus for a specific restaurant.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant for which menus are being fetched.
 * @returns A promise resolving to an object indicating the success status, data containing all menus, and potentially an error message.
 */
export const getAllMenus = async (userId: string, restaurantId: string) => {
  try {
    const menusRef = collection(firestore, `users/${userId}/restaurants/${restaurantId}/menus`);
    const querySnapshot = await getDocs(menusRef);

    const menus: MenuType[] = [];
    querySnapshot.forEach((doc) => {
      menus.push({ id: doc.id, ...doc.data() } as MenuType);
    });

    console.log("Fetched menus:", menus);
    return { success: true, data: menus };
  } catch (error) {
    console.error("Error fetching menus:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

/**
 * Creates a new menu for a specific restaurant and updates the activeMenuId if this is the first menu.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant for which the menu is being created.
 * @param menuData - The data for the new menu following the MenuType structure.
 * @returns A promise resolving to an object indicating the success status and potentially an error message.
 */
export const createMenu = async (userId: string, restaurantId: string, menuData: MenuType) => {
  try {
    const menusRef = collection(firestore, `users/${userId}/restaurants/${restaurantId}/menus`);

    // Add the new menu document
    const docRef = await addDoc(menusRef, menuData);

    // Construct the full menu data including the generated ID
    const fullMenuData: MenuType = { id: docRef.id, ...menuData };

    // Check and update activeMenuId if this is the first menu
    const restaurantRef = doc(firestore, `users/${userId}/restaurants`, restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (restaurantDoc.exists() && !restaurantDoc.data().activeMenuId) {
      await updateDoc(restaurantRef, { activeMenuId: docRef.id });
    }

    console.log("Menu created with ID: ", docRef.id);
    return { success: true, data: fullMenuData };
  } catch (error) {
    console.error("Error creating menu:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

/**
 * Creates a new section within a specified menu for a restaurant.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @param menuId - The ID of the menu to which the section will be added.
 * @param sectionData - The data for the new section, following the MenuSectionType structure minus the 'id'.
 * @returns A promise resolving to an object indicating the success status and the data of the created section including its Firestore-generated 'id'.
 */

export const createMenuSection = async (
  userId: string,
  restaurantId: string,
  menuId: string,
  sectionData: MenuSectionType
  ): Promise<{ success: boolean; data?: MenuSectionType | null; error?: string }> => {
  const sectionsRef = collection(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections`);
  const newSectionRef = doc(sectionsRef);
  const newSectionId = newSectionRef.id;
  
  let sectionImageResponse: { success: boolean, url?: string | null } = { success: false, url: null };

  // If there's image data, attempt to upload it
  if (sectionData.image && sectionData.image.blob) {
    sectionImageResponse = await uploadImageToStorage(userId, 'menuSections', `${newSectionId}.webp`, sectionData.image.blob);
    if (!sectionImageResponse.success) {
      return sectionImageResponse;
    }
  }

  try {
    // Prepare the section data for Firestore, adding the imageURL if available
    const firestoreSectionData = {
      ...sectionData,
      id: newSectionId,
      imageUrl: sectionImageResponse.url // This will be null if the image wasn't uploaded, matching your type requirement
    };
    delete firestoreSectionData.image; // Ensure we don't attempt to store the Blob or image object in Firestore

    await setDoc(newSectionRef, firestoreSectionData);

    console.log("Section created with ID: ", newSectionId);
    return { success: true, data: firestoreSectionData };
  } catch (error) {
    console.error("Error creating section:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred', data: null };
  }
};

/**
 * Creates a new item within a specified section with a menu for a restaurant.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @param menuId - The ID of the menu to which the section will be added.
 * @param sectionId - The ID of the section to which the item will be added.
 * @param itemData - The data for the new section, following the MenuSectionType structure minus the 'id'.
 * @returns A promise resolving to an object indicating the success status and the data of the created item including its Firestore-generated 'id'.
 */

export const createMenuItem = async (
  userId: string, 
  restaurantId: string, 
  menuId: string, 
  sectionId: string, 
  itemData: MenuItemType
): Promise<{ success: boolean; data?: MenuItemType | null; error?: string }> => {
  const itemsRef = collection(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}/items`);
  const newItemRef = doc(itemsRef);
  const newItemId = newItemRef.id

  let itemImageResponse: { success: boolean; url?: string | null } = { success: false, url: null };

  // If there's image data, attempt to upload it
  if (itemData.image && itemData.image.blob) {
    itemImageResponse = await uploadImageToStorage(userId, 'menuItems', `${newItemId}.webp`, itemData.image.blob);
    if (!itemImageResponse.success) {
      return itemImageResponse; // Return early if image upload fails
    }
  }

  try {
    // Prepare the item data for Firestore, adding 'imageUrl' if available
    const firestoreItemData = {
      ...itemData,
      id: newItemId,
      imageUrl: itemImageResponse.url, // This will be null if the image wasn't uploaded
    };
    delete firestoreItemData.image; // Ensure we don't attempt to store the Blob or image object in Firestore

    await setDoc(newItemRef, firestoreItemData);

    console.log("Item created with ID: ", newItemId);
    return { success: true, data: firestoreItemData };
  } catch (error) {
    console.error("Error creating item:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred', data: null };
  }
};

/**
 * Deletes a menu item and its associated image from storage, if applicable.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @param menuId - The ID of the menu.
 * @param sectionId - The ID of the section containing the item to be deleted.
 * @param itemId - The ID of the item to be deleted.
 * @param imageUrl - The URL of the image associated with the item, if any.
 * @returns A promise that resolves to an object indicating the success status of the operation.
 */
export const deleteMenuItem = async (
  userId: string, 
  restaurantId: string, 
  menuId: string, 
  sectionId: string, 
  itemId: string, 
  imageUrl?: string | null
) => {
  try {
    // Construct the reference to the menu item document
    const itemRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}/items/${itemId}`);

    // Delete the menu item document
    await deleteDoc(itemRef);

    // If an imageUrl is provided, delete the image from Firebase Storage
    if (imageUrl) {
      // Extract the image path from the imageUrl
      const imagePath = new URL(imageUrl).pathname;
      // Create a reference to the storage file
      const imageRef = ref(storage, imagePath);
      // Delete the file
      await deleteObject(imageRef);
    }

    console.log("Menu item deleted successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

/**
 * Deletes a menu section and its associated image from storage, if applicable.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @param menuId - The ID of the menu.
 * @param sectionId - The ID of the section containing the section to be deleted.
 * @param sectionImageUrl - The URL of the image associated with the section, if any.
 * @returns A promise that resolves to an object indicating the success status of the operation.
 */
export const deleteMenuSection = async (userId: string, restaurantId: string, menuId: string, sectionId: string, sectionImageUrl?: string | null) => {
  try {
    // Start a batch
    const batch = writeBatch(firestore);

    // Reference to the section's items subcollection
    const itemsRef = collection(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}/items`);
    const itemsQuery = query(itemsRef);
    const itemsSnapshot = await getDocs(itemsQuery);

    // Schedule each item for deletion in the batch
    itemsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);

      // Handle image deletion separately
      const itemImageUrl = doc.data().imageUrl as string | null | undefined;
      if (itemImageUrl) {
        const itemImagePath = new URL(itemImageUrl).pathname;
        const itemImageRef = ref(storage, itemImagePath);
        deleteObject(itemImageRef).catch(error => console.error("Error deleting item image:", error));
      }
    });

    // Delete the section document itself
    const sectionRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}`);
    batch.delete(sectionRef);

    // Commit the batch
    await batch.commit();

    // If the section has an associated image URL, delete the image from Firebase Storage
    if (sectionImageUrl) {
      const sectionImagePath = new URL(sectionImageUrl).pathname;
      const sectionImageRef = ref(storage, sectionImagePath);
      await deleteObject(sectionImageRef);
    }

    console.log("Menu section and its items deleted successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu section and its items:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

/**
 * Edits menu item within a specified section with a menu for a restaurant.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @param menuId - The ID of the menu to which the section will be added.
 * @param sectionId - The ID of the section to which the item will be added.
 * @param itemId - The ID of the edited item.
 * @param itemData - The data for the new item, following the MenuItemCreationType structure minus the 'id'.
 * @returns A promise resolving to an object indicating the success status and the data of the created item including its Firestore-generated 'id'.
 */
export const editMenuItem = async (
  userId: string, 
  restaurantId: string, 
  menuId: string, 
  sectionId: string, 
  itemId: string,
  itemData: MenuItemType
) => {
  let itemImageResponse: { success: boolean; url?: string | null } = { success: false, url: null };

  // If there's new image data, attempt to upload it, replacing the existing image if present
  if (itemData.image && itemData.image.blob) {
    itemImageResponse = await uploadImageToStorage(userId, 'menuItems', `${itemId}.webp`, itemData.image.blob);
    if (!itemImageResponse.success) {
      return itemImageResponse; // Return early if image upload fails
    }
  }

  try {
    // Prepare the item data for Firestore, updating 'imageUrl' only if a new image was uploaded
    const firestoreItemData = {
      ...itemData,
      imageUrl: itemImageResponse.url ? itemImageResponse.url : itemData.imageUrl, // Use the new image URL if uploaded, otherwise retain the existing URL
    };
    delete firestoreItemData.image; // Remove the image field as it's not needed for Firestore

    const itemRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}/items/${itemId}`);
    await setDoc(itemRef, firestoreItemData, { merge: true }); // Use merge option to update the existing document

    console.log("Item edited with ID: ", itemId);
    return { success: true, data: firestoreItemData };
  } catch (error) {
    console.error("Error editing item:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred', data: null };
  }
};

/**
 * Edits menu section within a menu for a restaurant.
 * 
 * @param userId - The ID of the user owning the restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @param menuId - The ID of the menu to which the section will be added.
 * @param sectionId - The ID of the section to which the item will be added.
 * @param sectionData - The data for the new section, following the SectionDataType structure minus the 'id'.
 * @returns A promise resolving to an object indicating the success status and the data of the created item including its Firestore-generated 'id'.
 */
export const editMenuSection = async (
  userId: string, 
  restaurantId: string, 
  menuId: string, 
  sectionId: string, 
  sectionData: MenuSectionType
) => {
  let sectionImageResponse: { success: boolean, url?: string | null } = { success: false, url: null };

  // If there's new image data, attempt to upload it, replacing the existing image if present
  if (sectionData.image && sectionData.image.blob) {
    sectionImageResponse = await uploadImageToStorage(userId, 'menuSections', `${sectionId}.webp`, sectionData.image.blob);
    if (!sectionImageResponse.success) {
      return sectionImageResponse;
    }
  }

  try {
    // Prepare the section data for Firestore, updating 'imageUrl' only if a new image was uploaded
    const firestoreSectionData = {
      ...sectionData,
      imageUrl: sectionImageResponse.url ? sectionImageResponse.url : sectionData.imageUrl, // Use the new image URL if uploaded, otherwise retain the existing URL
    };
    delete firestoreSectionData.image; // Remove the image field as it's not needed for Firestore

    const sectionRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}`);
    await setDoc(sectionRef, firestoreSectionData, { merge: true }); // Use merge option to update the existing document

    console.log("Section edited with ID: ", sectionId);
    return { success: true, data: firestoreSectionData };
  } catch (error) {
    console.error("Error editing section:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred', data: null };
  }
};

/**
 * Fetches a menu by its ID, including all sections and items within those sections.
 * 
 * @param {string} userId The ID of the user owning the restaurant.
 * @param {string} restaurantId The ID of the restaurant.
 * @param {string} menuId The ID of the menu to fetch.
 * @returns {Promise<{success: boolean, data?: MenuType, error?: string}>} The menu data with sections and items, or an error message.
 */
export const fetchMenu = async (userId: string, restaurantId: string, menuId: string) => {
  try {
    // Fetch the menu document
    const menuRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}`);
    const menuSnap = await getDoc(menuRef);

    if (!menuSnap.exists()) {
      throw new Error("Menu not found");
    }

    const menuData = menuSnap.data();
    menuData.id = menuSnap.id; // Ensure the menu ID is included in the data

    // Fetch sections for the menu
    const sectionsRef = collection(firestore, menuRef.path + '/sections');
    const sectionsQuery = query(sectionsRef);
    const sectionsSnap = await getDocs(sectionsQuery);

    const sections = await Promise.all(sectionsSnap.docs.map(async (sectionDoc) => {
      const sectionData = sectionDoc.data();
      sectionData.id = sectionDoc.id; // Ensure the section ID is included

      // Fetch items for each section
      const itemsRef = collection(firestore, sectionDoc.ref.path + '/items');
      const itemsSnap = await getDocs(itemsRef);
      
      const items = itemsSnap.docs.map(itemDoc => {
        const itemData = itemDoc.data();
        itemData.id = itemDoc.id; // Ensure the item ID is included
        return itemData;
      });

      sectionData.items = items; // Assign items to the section
      return sectionData;
    }));

    menuData.sections = sections; // Assign sections to the menu

    return { success: true, data: menuData };
  } catch (error) {
    console.error("Error fetching menu:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

export const updateSectionSortOrder = async (
  userId: string,
  restaurantId: string,
  menuId: string,
  sectionId: string,
  newSortOrder: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const sectionRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}`);
    await updateDoc(sectionRef, { sortOrder: newSortOrder });

    return { success: true };
  } catch (error) {
    console.error("Error updating section sort order:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

export const updateItemSortOrder = async (
  userId: string,
  restaurantId: string,
  menuId: string,
  sectionId: string,
  itemId: string,
  newSortOrder: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const itemRef = doc(firestore, `users/${userId}/restaurants/${restaurantId}/menus/${menuId}/sections/${sectionId}/items/${itemId}`);
    await updateDoc(itemRef, { sortOrder: newSortOrder });

    return { success: true };
  } catch (error) {
    console.error("Error updating item sort order:", error);
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
};

export { };
