import { firestore } from './firebaseConfig';
import { ContactType, CreateContactResponse } from '../types/contact'
import { doc, addDoc, collection, onSnapshot, updateDoc, deleteDoc, query, orderBy, getDoc, getDocs, QuerySnapshot, Timestamp, DocumentData } from "@firebase/firestore";

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// export const createContact = async (userId: string, profileId: string, contactData: ContactType): Promise<CreateContactResponse> => {
//   try {
//     const contactsCollectionRef = collection(firestore, `users/${userId}/profiles/${profileId}/contacts`);
//     const contactDocRef = await addDoc(contactsCollectionRef, contactData);
//     // Add the document ID to the contactData
//     const contactWithId: ContactType = {
//       ...contactData,
//       id: contactDocRef.id
//     };
//     return { success: true, data: contactWithId };
//   } catch (error) {
//     console.error("Error adding document: ", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

export const createContact = (userId: string, profileId: string, contactData: ContactType): Promise<CreateContactResponse> => {
  return new Promise<CreateContactResponse>((resolve, reject) => {
    const contactsCollectionRef = collection(firestore, `users/${userId}/profiles/${profileId}/contacts`);
    
    // Create the document
    addDoc(contactsCollectionRef, contactData).then(contactDocRef => {
      // Use the document ID and check its state
      const unsubscribe = onSnapshot(contactDocRef, snapshot => {
        // Check if there are pending writes
        if (!snapshot.metadata.hasPendingWrites) {
          const contactWithId: ContactType = {
            ...contactData,
            id: contactDocRef.id
          };
          resolve({ success: true, data: contactWithId });
          unsubscribe();  // Important: We stop listening after confirming the creation.
        }
      }, error => {
        console.error("Snapshot error:", error);
        reject({ success: false, error: error.message });
        unsubscribe();  // Important: Stop listening if there's an error.
      });

    }).catch(error => {
      // Directly reject if there's an error in the create attempt
      console.error("Error adding document: ", error);
      reject({ success: false, error: (error as Error).message });
    });
  });
};

// export const getAllProfileContacts = async (userId: string, profileId: string): Promise<APIResponse<ContactType[]>> => {
//   try {
//     const contactsCollectionRef = collection(firestore, `users/${userId}/profiles/${profileId}/contacts`);
//     const contactsQuery = query(contactsCollectionRef, orderBy('firstName', 'asc'));
//     const contactsSnapshot = await getDocs(contactsQuery);

//     const contacts: ContactType[] = [];

//     if (contactsSnapshot.empty) {
// 			return { success: true, data: [] };
// 		} else {
//       contactsSnapshot.forEach(doc => {
// 				const contact = doc.data() as ContactType;
// 				// Convert Firestore Timestamp to JS Date
// 				if (contact.createdOn && typeof contact.createdOn !== 'string') {
// 					const createdOnTimestamp = contact.createdOn as unknown as Timestamp;
// 					contact.createdOn = new Date(createdOnTimestamp.seconds * 1000);
// 				}
				
//         contacts.push({ ...contact, id: doc.id });
// 			});
//     }

//     return { success: true, data: contacts };
//   } catch (error) {
//     return { success: false, data: [], error: (error as Error).message };
//   }
// };

export const getAllProfileContacts = (userId: string, profileId: string): Promise<APIResponse<ContactType[]>> => {
  return new Promise<APIResponse<ContactType[]>>((resolve, reject) => {
    const contactsCollectionRef = collection(firestore, `users/${userId}/profiles/${profileId}/contacts`);
    const contactsQuery = query(contactsCollectionRef, orderBy('firstName', 'asc'));

    const processSnapshot = (contactsSnapshot: QuerySnapshot<DocumentData>, fromCache: boolean) => {
      const contacts: ContactType[] = [];

      if (fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }

      if (contactsSnapshot.empty) {
        resolve({ success: true, data: [] });
      } else {
        contactsSnapshot.forEach(doc => {
          const contact = doc.data() as ContactType;
          if (contact.createdOn && typeof contact.createdOn !== 'string') {
            const createdOnTimestamp = contact.createdOn as unknown as Timestamp;
            contact.createdOn = new Date(createdOnTimestamp.seconds * 1000);
          }
          contacts.push({ ...contact, id: doc.id });
        });
        resolve({ success: true, data: contacts });
      }
    };

    const unsubscribe = onSnapshot(contactsQuery, contactsSnapshot => {
      if (contactsSnapshot.metadata.fromCache) {
        // Attempt to fetch from server
        getDocs(contactsQuery).then(serverSnapshot => {
          processSnapshot(serverSnapshot, false);
        }).catch(serverError => {
          console.error("Error fetching from server:", serverError);
          processSnapshot(contactsSnapshot, true); // Fall back to cached data if server fetch fails
        });
      } else {
        processSnapshot(contactsSnapshot, false);
      }
    }, error => {
      console.error("Snapshot error:", error);
      reject({ success: false, data: [], error: error.message });
      unsubscribe();  // Stop listening if there's an error.
    });
  });
};



// export const editContactById = async (userId: string, profileId: string, contactId: string, updatedData: Partial<ContactType>): Promise<APIResponse<void>> => {
//   try {
//     const contactDocRef = doc(firestore, `users/${userId}/profiles/${profileId}/contacts/${contactId}`);
//     await updateDoc(contactDocRef, updatedData);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: (error as Error).message };
//   }
// };

export const editContactById = async (userId: string, profileId: string, contactId: string, updatedData: Partial<ContactType>): Promise<APIResponse<void>> => {
  const contactDocRef = doc(firestore, `users/${userId}/profiles/${profileId}/contacts/${contactId}`);
  
  try {
    // Update the document
    await updateDoc(contactDocRef, updatedData);

    // Fetch the document to confirm the update
    const snapshot = await getDoc(contactDocRef);
    if (snapshot.exists()) {
      return { success: true };
    } else {
      throw new Error('Contact document does not exist post-update.');
    }
  } catch (error) {
    console.error("Error in editContactById:", error);
    return { success: false, error: (error as Error).message };
  }
};


// export const deleteContactById = async (userId: string, profileId: string, contactId: string): Promise<APIResponse<void>> => {
//   try {
//     const contactDocRef = doc(firestore, `users/${userId}/profiles/${profileId}/contacts/${contactId}`);
//     await deleteDoc(contactDocRef);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: (error as Error).message };
//   }
// };

export const deleteContactById = (userId: string, profileId: string, contactId: string): Promise<APIResponse<void>> => {
  return new Promise<APIResponse<void>>((resolve, reject) => {
    const contactDocRef = doc(firestore, `users/${userId}/profiles/${profileId}/contacts/${contactId}`);
    
    // Delete the document
    deleteDoc(contactDocRef).catch(error => {
      // Directly reject if there's an error in the delete attempt
      reject({ success: false, error: (error as Error).message });
    });
    
    const unsubscribe = onSnapshot(contactDocRef, snapshot => {
      // Check if there are pending writes
      if (!snapshot.metadata.hasPendingWrites) {
        if (!snapshot.exists()) {
          resolve({ success: true });
        } else {
          reject({ success: false, error: 'Contact document still exists post-deletion.' });
        }
        
        unsubscribe();  // Important: We stop listening after confirming the deletion.
      }
    }, error => {
      console.error("Snapshot error:", error);
      reject({ success: false, error: error.message });
      unsubscribe();  // Important: Stop listening if there's an error.
    });
  });
};
