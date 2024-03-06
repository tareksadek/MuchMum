import { firestore } from './firebaseConfig';
import {
  Timestamp, QuerySnapshot, doc, setDoc, getDoc, collection,
  where, getDocs, query, deleteDoc, updateDoc, serverTimestamp, onSnapshot, DocumentSnapshot, orderBy, limit,
} from '@firebase/firestore';
import { UserType } from '../types/user';

export const createUserDocument = async (userId: string, userData: Partial<UserType>) => {
	try {
		const userRef = doc(firestore, 'users', userId);
		await setDoc(userRef, userData);
		return { success: true };
	} catch (error) {
		console.error("Error creating user document:", error);
		return { success: false, error: (error as Error).message };
	}
};

// export const getUserById = async (userId: string) => {
// 	try {
// 		const userRef = doc(firestore, 'users', userId);
// 		const userDoc = await getDoc(userRef);

// 		if (userDoc.exists()) {
// 			const user = userDoc.data()
// 			if (user.createdOn && typeof user.createdOn !== 'string') {
// 				const createdOnTimestamp = user.createdOn as unknown as Timestamp;
// 				user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
// 			}
// 			if (user.lastLogin && typeof user.lastLogin !== 'string') {
// 				const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
// 				user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
// 			}
// 			const userData = { ...user, id: userId };
// 			return { success: true, data: userData };
// 		} else {
// 			throw new Error('User document does not exist');
// 		}
// 	} catch (error) {
// 		console.error("Error fetching user document:", error);
// 		return { success: false, error: (error as Error).message };
// 	}
// };

// export const getUserById = (userId: string) => {
//   return new Promise<{ success: boolean, data?: any, error?: string }>((resolve, reject) => {
//     const userRef = doc(firestore, 'users', userId);
    
//     const unsubscribe = onSnapshot(userRef, userDoc => {
//       if (userDoc.metadata.fromCache) {
//         console.log("Data came from cache.");
//       } else {
//         console.log("Data came from the server.");
//       }
      
//       if (userDoc.exists()) {
//         let user = userDoc.data() as any;
//         if (user.createdOn && typeof user.createdOn !== 'string') {
//           const createdOnTimestamp = user.createdOn as unknown as Timestamp;
//           user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
//         }
//         if (user.lastLogin && typeof user.lastLogin !== 'string') {
//           const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
//           user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
//         }
//         const userData = { ...user, id: userId };
//         resolve({ success: true, data: userData });
//       } else {
//         reject({ success: false, error: 'User document does not exist' });
//       }

//       unsubscribe();  // Important: We stop listening after handling the initial snapshot.

//     }, error => {
//       console.error("Snapshot error:", error);
//       reject({ success: false, error: error.message });
//       unsubscribe();  // Important: Stop listening if there's an error.
//     });
//   });
// };

const processUserData = (doc: DocumentSnapshot) => {
  let user = doc.data();
  // Process user data
  if (user && user.createdOn && typeof user.createdOn !== 'string') {
    const createdOnTimestamp = user.createdOn as unknown as Timestamp;
    user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
  }
  if (user && user.lastLogin && typeof user.lastLogin !== 'string') {
    const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
    user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
  }
  return { ...user, id: doc.id };
};

// export const getUserById = (userId: string) => {
//   return new Promise<{ success: boolean, data?: any, error?: string }>(async (resolve, reject) => {
//     const userRef = doc(firestore, 'users', userId);
    
//     try {
//       const userDoc = await getDoc(userRef);

//       if (userDoc.metadata.fromCache) {
//         console.log("Data came from cache.");
//       } else {
//         console.log("Data came from the server.");
//       }

//       if (userDoc.exists()) {
//         let user = userDoc.data() as any;
//         if (user.createdOn && typeof user.createdOn !== 'string') {
//           const createdOnTimestamp = user.createdOn as unknown as Timestamp;
//           user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
//         }
//         if (user.lastLogin && typeof user.lastLogin !== 'string') {
//           const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
//           user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
//         }
//         const userData = { ...user, id: userId };
//         resolve({ success: true, data: userData });
//       } else {
//         reject({ success: false, error: 'User document does not exist' });
//       }
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       reject({ success: false, error: (error as Error).message });
//     }
//   });
// };

// export const getUserById = (userId: string) => {
//   return new Promise<{ success: boolean; data?: any; error?: string }>((resolve, reject) => {
//     const userRef = doc(firestore, 'users', userId);

//     // First, use onSnapshot for immediate data
//     const unsubscribe = onSnapshot(
//       userRef,
//       (userDoc) => {
//         if (userDoc.exists()) {
//           const userData = processUserData(userDoc);
//           resolve({ success: true, data: userData });
//         } else if (userDoc.metadata.fromCache) {
//           // If data is from cache and not exists, try fetching from server
//           getDoc(userRef).then((serverDoc) => {
//             if (serverDoc.exists()) {
//               const userData = processUserData(serverDoc);
//               resolve({ success: true, data: userData });
//             } else {
//               reject({ success: false, error: 'User document does not exist' });
//             }
//           }).catch((error) => {
//             console.error("Error fetching user from server:", error);
//             reject({ success: false, error: (error as Error).message });
//           });
//         } else {
//           reject({ success: false, error: 'User document does not exist' });
//         }
//         unsubscribe();
//       },
//       (error) => {
//         console.error("Snapshot error:", error);
//         reject({ success: false, error: error.message });
//         unsubscribe();
//       }
//     );
//   });
// };

function getLocalUserVersion(userId: string) {
  return localStorage.getItem(`userVersion_${userId}`);
}

function updateLocalUserVersion(userId: string, serverVersion: string) {
  localStorage.setItem(`userVersion_${userId}`, serverVersion.toString());
}

export const getUserById = (userId: string) => {
  return new Promise<{ success: boolean; data?: any; error?: string }>((resolve, reject) => {
    const userRef = doc(firestore, 'users', userId);

    getDoc(userRef).then((userSnapshot) => {
      if (!userSnapshot.exists()) {
        reject({ success: false, error: 'User document does not exist' });
        return;
      }      

      const isOnline = navigator.onLine;
      const localUserVersion = getLocalUserVersion(userId);
      // Provide a default version (e.g., 0) if the version field is missing
      const remoteUserVersion = userSnapshot.data().version || 0;

      if (isOnline) {
        // console.log("Online mode detected for user document.");
        if (Number(localUserVersion) === Number(remoteUserVersion)) {
          console.log("User data fetched from cache (versions match).");
          // Logic to use cached data
        } else {
          console.log("User data fetched from server (version mismatch). Updating local user version.");
          updateLocalUserVersion(userId, remoteUserVersion);
        }
      } else {
        console.log("Offline mode detected. User data fetched from cache.");
      }

      let userData = processUserData(userSnapshot);
      resolve({ success: true, data: userData });

    }).catch((error) => {
      console.error("Error fetching user document:", error);
      reject({ success: false, error: (error as Error).message });
    });
  });
};


// export const getUserByRestaurantSuffix = (restaurantSuffix: string) => {
//   return new Promise<{ success: boolean, data?: any, error?: string }>((resolve, reject) => {
//     const userRef = collection(firestore, "users");
//     const q = query(userRef, where("profileUrlSuffix", "==", restaurantSuffix));

//     getDocs(q).then(userSnapshot => {
//       if (!userSnapshot.empty) {
//         const firstDoc = userSnapshot.docs[0];
//         if (!firstDoc.exists()) {
//           reject({ success: false, error: 'User not found' });
//           return;
//         }

//         const isOnline = navigator.onLine;
//         const localUserVersion = getLocalUserVersion(restaurantSuffix);
//         // Provide a default version (e.g., 0) if the version field is missing
//         const remoteUserVersion = firstDoc.data().version || 0;

//         if (isOnline) {
//           // console.log("Online mode detected for user document by profile suffix.");
//           if (Number(localUserVersion) === Number(remoteUserVersion)) {
//             console.log("User data fetched from cache (versions match).");
//             // Logic to use cached data
//           } else {
//             console.log("User data fetched from server (version mismatch). Updating local user version by profile suffix.");
//             updateLocalUserVersion(restaurantSuffix, remoteUserVersion);
//           }
//         } else {
//           console.log("Offline mode detected. User data fetched from cache.");
//         }

//         const userData = processUserData(firstDoc);
//         console.log(userData);
        
//         resolve({ success: true, data: userData });

//       } else {
//         reject({ success: false, error: 'User not found' });
//       }
//     }).catch(error => {
//       console.error("Error fetching user by profile suffix:", error);
//       reject({ success: false, error: (error as Error).message });
//     });
//   });
// };

export const getUserByRestaurantSuffix = (restaurantSuffix: string) => {
  return new Promise<{ success: boolean, data?: any, error?: string }>((resolve, reject) => {
    const userRef = collection(firestore, "users");
    const q = query(userRef, where("profileUrlSuffix", "==", restaurantSuffix));

    getDocs(q).then(userSnapshot => {
      if (!userSnapshot.empty) {
        const firstDoc = userSnapshot.docs[0];
        if (!firstDoc.exists()) {
          reject({ success: false, error: 'User not found' });
          return;
        }

        // Assuming processUserData and updateLocalUserVersion can run on both client and server
        const userData = processUserData(firstDoc);
        console.log(userData);

        // Check if running in a browser environment
        if (typeof window !== 'undefined') {
          const isOnline = navigator.onLine;
          const localUserVersion = getLocalUserVersion(restaurantSuffix);
          const remoteUserVersion = firstDoc.data().version || 0;

          if (isOnline) {
            if (Number(localUserVersion) === Number(remoteUserVersion)) {
              console.log("User data fetched from cache (versions match).");
            } else {
              console.log("User data fetched from server (version mismatch). Updating local user version by profile suffix.");
              updateLocalUserVersion(restaurantSuffix, remoteUserVersion);
            }
          } else {
            console.log("Offline mode detected. User data fetched from cache.");
          }
        }
        console.log('user fetching resovled')
        resolve({ success: true, data: userData });
      } else {
        reject({ success: false, error: 'User not found' });
      }
    }).catch(error => {
      console.error("Error fetching user by profile suffix:", error);
      reject({ success: false, error: (error as Error).message });
    });
  });
};


export const doesUserWithProfileSuffixExist = (profileSuffix: string) => {
  return new Promise<{ exists: boolean, error?: string }>((resolve, reject) => {
    const userRef = collection(firestore, "users");
    const querySuffix = query(userRef, where("profileUrlSuffix", "==", profileSuffix));

    getDocs(querySuffix)
      .then(userSnapshot => {
        resolve({ exists: !userSnapshot.empty });
      })
      .catch(error => {
        console.error("Error checking user by profile suffix:", error);
        reject({ exists: false, error: (error as Error).message });
      });
  });
};

const deleteSubcollection = async (parentRef: any, subcollectionName: string) => {
	const subcolRef = collection(parentRef, subcollectionName);
	const snapshot = await getDocs(subcolRef);

	if (!snapshot.empty) {
		for (const doc of snapshot.docs) {
			await deleteDoc(doc.ref);
		}
	}
};

const deleteProfilesAndSubcollections = async (userRef: any) => {
	const profilesColRef = collection(userRef, 'profiles');
	const profileSnapshot = await getDocs(profilesColRef);

	for (const profileDoc of profileSnapshot.docs) {
		// Delete subcollections of each profile
		await deleteSubcollection(profileDoc.ref, 'profileImage');
		await deleteSubcollection(profileDoc.ref, 'links');
		await deleteSubcollection(profileDoc.ref, 'visits');

		// Delete the profile document itself
		await deleteDoc(profileDoc.ref);
	}
}

export const deleteUserDocument = async (userId: string) => {
	const userRef = doc(firestore, 'users', userId);

	// Delete profiles and their subcollections
	await deleteProfilesAndSubcollections(userRef);

	// Delete the main user document
	await deleteDoc(userRef);

	return { success: true };
};

// export const getAllUsers = async (): Promise<{ success: boolean; data: UserType[]; error?: string }> => {
//   try {
//     const usersRef = collection(firestore, 'users');
//     const usersSnapshot = await getDocs(usersRef);

// 		const users: UserType[] = [];

// 		if (usersSnapshot.empty) {
// 			return { success: true, data: [] };
// 		} else {
// 			usersSnapshot.forEach(doc => {
// 				const user = doc.data() as UserType;
// 				// Convert Firestore Timestamp to JS Date
// 				if (user.createdOn && typeof user.createdOn !== 'string') {
// 					const createdOnTimestamp = user.createdOn as unknown as Timestamp;
// 					user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
// 				}
// 				if (user.lastLogin && typeof user.lastLogin !== 'string') {
// 					const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
// 					user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
// 				}
				
// 				if (!user.isAdmin) {
//           users.push({ ...user, id: doc.id });
//         }
// 			});
			
// 			return { success: true, data: users };
// 		}
//   } catch (error) {
//     console.error("Error fetching all users:", error);
//     return { success: false, data: [], error: (error as Error).message };
//   }
// };

export const getAllUsers = (): Promise<{ success: boolean; data: UserType[]; error?: string }> => {
  return new Promise<{ success: boolean; data: UserType[]; error?: string }>(async (resolve, reject) => {
    const usersRef = query(collection(firestore, 'users'));

    const handleSnapshot = (usersSnapshot: QuerySnapshot) => {
      const users: UserType[] = [];

      if (usersSnapshot.empty) {
        resolve({ success: true, data: [] });
      } else {
        usersSnapshot.forEach(doc => {
          const user = doc.data() as UserType;
          if (user.createdOn && typeof user.createdOn !== 'string') {
            const createdOnTimestamp = user.createdOn as unknown as Timestamp;
            user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
          }
          if (user.lastLogin && typeof user.lastLogin !== 'string') {
            const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
            user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
          }
          if (!user.isAdmin) {
            users.push({ ...user, id: doc.id });
          }
        });
        resolve({ success: true, data: users });
      }
    };

    try {
      // Try fetching from server first
      const usersSnapshot = await getDocs(usersRef);
      if (usersSnapshot.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }
      handleSnapshot(usersSnapshot);
    } catch (error) {
      console.error("Snapshot error:", error);
      reject({ success: false, data: [], error: (error as Error).message });
    }
  });
};

export const getRecentUsers = async (): Promise<UserType[]> => {
  try {
    const usersRef = query(collection(firestore, 'users'), orderBy('createdOn', 'desc'), limit(5));
    const usersSnapshot = await getDocs(usersRef);
    const users: UserType[] = [];

    usersSnapshot.forEach(doc => {
      const user = doc.data() as UserType;
      if (user.createdOn && typeof user.createdOn !== 'string') {
        const createdOnTimestamp = user.createdOn as unknown as Timestamp;
        user.createdOn = new Date(createdOnTimestamp.seconds * 1000);
      }
      if (user.lastLogin && typeof user.lastLogin !== 'string') {
        const lastLoginTimestamp = user.lastLogin as unknown as Timestamp;
        user.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
      }
      if (!user.isAdmin) {
        users.push({ ...user, id: doc.id });
      }
    });

    return users;
  } catch (error) {
    console.error("Error fetching recent users:", error);
    throw new Error((error as Error).message);
  }
};





// export const updateActiveProfileId = async (userId: string, activeProfileId: string) => {
// 	try {
// 			const userRef = doc(firestore, 'users', userId);
// 			await updateDoc(userRef, {
// 					activeProfileId: activeProfileId
// 			});
// 			return { success: true };
// 	} catch (error) {
// 			console.error("Error updating active profile ID:", error);
// 			return { success: false, error: (error as Error).message };
// 	}
// };

export const updateActiveProfileId = (userId: string, activeProfileId: string): Promise<{ success: boolean; error?: string }> => {
	return new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
		const userRef = doc(firestore, 'users', userId);

    const localVersion = parseInt(getLocalUserVersion(userId) || '1');
    const newVersion = localVersion === 1 ? 2 : 1;

		// Start the update operation
		updateDoc(userRef, {
			activeProfileId: activeProfileId,
      version: newVersion
		}).then(() => {
      updateLocalUserVersion(userId, newVersion.toString());
			// Once the update is made, set up a listener to track the update status
			const unsubscribe = onSnapshot(userRef, docSnapshot => {
				if (docSnapshot.metadata.hasPendingWrites) {
					console.log("Local write in progress...");
				} else if (docSnapshot.metadata.fromCache) {
					console.log("Data came from cache.");
					resolve({ success: true });
				} else {
					console.log("Data came from the server.");
					resolve({ success: true });
				}

				unsubscribe();
			});
		}).catch(error => {
			console.error("Error updating active profile ID:", error);
			reject({ success: false, error: (error as Error).message });
		});
	});
};

export const updateLastLogin = async (userId: string) => {
	try {
			const userRef = doc(firestore, 'users', userId);
			await updateDoc(userRef, {
					lastLogin: serverTimestamp()
			});
			return { success: true };
	} catch (error) {
			console.error("Error updating last login:", error);
			return { success: false, error: (error as Error).message };
	}
};

// export const redirectUserProfiles = async (userId: string, active: boolean, redirectUrl?: string) => {
//   try {
//     const userRef = doc(firestore, 'users', userId);

//     // Check if redirectUrl is available when trying to activate
//     if (active && !redirectUrl) {
//       throw new Error("A URL is required to activate redirection.");
//     }

//     await updateDoc(userRef, {
//       redirect: {
//         active,
//         url: redirectUrl || null
//       }
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Error redirecting profiles:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

export const redirectUserProfiles = async (userId: string, active: boolean, redirectUrl?: string) => {
  const userRef = doc(firestore, 'users', userId);
  const localVersion = parseInt(getLocalUserVersion(userId) || '1');
  const newVersion = localVersion === 1 ? 2 : 1;

  // Check if redirectUrl is available when trying to activate
  if (active && !redirectUrl) {
    const errMsg = "A URL is required to activate redirection.";
    console.error(errMsg);
    return { success: false, error: errMsg };
  }

  // Start the write operation
  updateDoc(userRef, {
    redirect: {
      active,
      url: redirectUrl || null
    },
    version: newVersion
  }).then(() => {
    updateLocalUserVersion(userId, newVersion.toString());
  }).catch(error => {
    console.error("Error redirecting profiles:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.metadata.hasPendingWrites) {
        console.log("Data is being written...");
      }

      if (doc.metadata.fromCache) {
        console.log("Data came from cache.");
        unsubscribe(); // Stop listening to changes.
        resolve({ success: true });
      }

      if (!doc.metadata.hasPendingWrites && !doc.metadata.fromCache) {
        console.log("Data came from the server.");
        unsubscribe(); // Stop listening to changes.
        resolve({ success: true });
      }
    }, (error) => {
      console.error("Snapshot error:", error);
      unsubscribe();
      reject({ success: false, error: error.message });
    });
  });
};

export { };
