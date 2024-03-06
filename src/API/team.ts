import { firestore, storage } from './firebaseConfig';
import { Timestamp, doc, onSnapshot, deleteDoc, collection, query, where, getDocs, updateDoc, addDoc, getDoc, QuerySnapshot, DocumentSnapshot, DocumentData } from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import isEqual from 'lodash/isEqual';
import { UserType } from '../types/user';
import { TeamDataType } from '../types/team';
import { ProfileDataType } from '../types/restaurant';
import { InvitationData } from '../types/userInvitation';
import { LinkType } from '../types/restaurant';
import { BasicInfoFormDataTypes, AboutFormDataTypes, ContactFormType, ThemeSettingsType, ColorType } from '../types/restaurant';

export const uploadImageToStorage = async (userId: string, folderName: string, imageName: string, blobData: Blob) => {
  try {
    const imageRef = ref(storage, `teams/${userId}/${folderName}/${imageName}`);
    await uploadBytes(imageRef, blobData); // using uploadBytes instead of uploadString
    const downloadURL = await getDownloadURL(imageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Error uploading team image:", error);
    return { success: false, error: (error as Error).message };
  }
};

// export const fetchTeamDoc = (teamId: string) => {
//   return new Promise<any>((resolve, reject) => {
    
//     const teamRef = doc(firestore, 'teams', teamId);
        
//     const unsubscribeTeam = onSnapshot(teamRef, teamSnapshot => {      
//       if (teamSnapshot.metadata.fromCache) {
//         console.log("Data came from cache.");
//       } else {
//         console.log("Data came from the server.");
//       }
//       if (teamSnapshot.exists()) {
//         let teamData: any = teamSnapshot.data();

//         const linksCollectionRef = collection(teamRef, 'links');

//         const unsubscribeLinks = onSnapshot(linksCollectionRef, linksSnapshot => {
//           let socialLinks: any[] = [];
//           let customLinks: any[] = [];

//           linksSnapshot.docs.forEach(doc => {
//             const linkData = doc.data();
//             linkData.id = doc.id;
//             if (linkData.isSocial) {
//               socialLinks.push(linkData);
//             } else if (linkData.isCustom) {
//               customLinks.push(linkData);
//             }
//           });

//           // Sort the links
//           socialLinks.sort((a, b) => a.position - b.position);
//           customLinks.sort((a, b) => a.position - b.position);
//           teamData.links = { social: socialLinks, custom: customLinks };
//           resolve(teamData);
//         }, error => {
//           console.error("Error fetching links:", error);
//           reject({ success: false, error: error.message });
//         });

        
//       } else {
//         reject(new Error('Document does not exist'));
//       }
//       unsubscribeTeam();  // Important: We stop listening after handling the initial snapshot.
//     }, error => {
//       console.error("Snapshot error:", error);
//       reject(error);
//       unsubscribeTeam();  // Important: Stop listening if there's an error.
//     });
//   });
// };

// export const fetchTeamDoc = async (teamId: string) => {
//   try {
//     const teamRef = doc(firestore, 'teams', teamId);
//     const teamSnapshot = await getDoc(teamRef);

//     if (!teamSnapshot.exists()) {
//       throw new Error('Team document does not exist');
//     }

//     let teamData = teamSnapshot.data();

//     // Get the links subcollection
//     const linksCollectionRef = collection(teamRef, 'links');
//     const linksSnapshot = await getDocs(linksCollectionRef);

//     let socialLinks: any[] = [];
//     let customLinks: any[] = [];

//     linksSnapshot.docs.forEach(doc => {
//       const linkData = doc.data();
//       linkData.id = doc.id;
//       if (linkData.isSocial) {
//         socialLinks.push(linkData);
//       } else if (linkData.isCustom) {
//         customLinks.push(linkData);
//       }
//     });

//     // Sort the links
//     socialLinks.sort((a, b) => a.position - b.position);
//     customLinks.sort((a, b) => a.position - b.position);
//     teamData.links = { social: socialLinks, custom: customLinks };

//     return { success: true, data: teamData };

//   } catch (error) {
//     console.error("Error fetching team document:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };

function getLocalVersion() {
  return localStorage.getItem('teamVersion');
}

function updateLocalVersion(serverVersion: string) {
  localStorage.setItem('teamVersion', serverVersion.toString());
}

export const fetchTeamDoc = async (teamId: string) => {
  try {
    const teamRef = doc(firestore, 'teams', teamId);
    const teamSnapshot = await getDoc(teamRef);

    if (!teamSnapshot.exists()) {
      throw new Error('Team document does not exist');
    }

    const isOnline = navigator.onLine;
    const localTeamVersion = getLocalVersion();
    
    const remoteTeamVersion = teamSnapshot.data().version;

    if (isOnline) {
      console.log("Online mode detected for team document.");
      if (Number(localTeamVersion) === Number(remoteTeamVersion)) {
        console.log("Team data fetched from cache (versions match).");
        // Logic to use cached data
      } else {
        console.log("Team data fetched from server (version mismatch). Updating local team version.");
        updateLocalVersion(remoteTeamVersion);
      }
    } else {
      console.log("Offline mode detected. Team data fetched from cache.");
    }

    let teamData = teamSnapshot.data();

    const linksCollectionRef = collection(teamRef, 'links');
    const linksSnapshot = await getDocs(linksCollectionRef);

    let socialLinks: any[] = [];
    let customLinks: any[] = [];

    linksSnapshot.docs.forEach(doc => {
      const linkData = doc.data();
      linkData.id = doc.id;
      if (linkData.isSocial) {
        socialLinks.push(linkData);
      } else if (linkData.isCustom) {
        customLinks.push(linkData);
      }
    });

    // Sort the links
    socialLinks.sort((a, b) => a.position - b.position);
    customLinks.sort((a, b) => a.position - b.position);
    teamData.links = { social: socialLinks, custom: customLinks };

    return { success: true, data: teamData };

  } catch (error) {
    console.error("Error fetching team document:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const teamExists = async (teamId: string): Promise<boolean> => {
  try {
    const teamRef = doc(firestore, 'teams', teamId);
    const teamSnapshot = await getDoc(teamRef);
    return teamSnapshot.exists();
  } catch (error) {
    console.error("Error checking if team exists:", error);
    return false; // Assuming that if there's an error, the team doesn't exist or can't be accessed
  }
};

// export const getTeam = (
//   batchId: string
// ): Promise<{
//   success: boolean;
//   data: { members: UserType[]; unusedInvitations: InvitationData[] };
//   error?: string;
// }> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Query for users belonging to the batch
//       const membersQuery = query(
//         collection(firestore, 'users'),
//         where('batchId', '==', batchId)
//       );
//       const membersSnapshot = await getDocs(membersQuery);

//       // Collect members data
//       const members: UserType[] = [];
//       const profilePromises: Promise<{ member: UserType, profileSnapshot: DocumentSnapshot<DocumentData> }>[] = [];

//       membersSnapshot.forEach((memberDoc) => {
//         const member = memberDoc.data() as UserType;
//         if (member.createdOn && typeof member.createdOn !== 'string') {
//           const createdOnTimestamp = member.createdOn as unknown as Timestamp;
//           member.createdOn = new Date(createdOnTimestamp.seconds * 1000);
//         }
//         if (member.lastLogin && typeof member.lastLogin !== 'string') {
//           const lastLoginTimestamp = member.lastLogin as unknown as Timestamp;
//           member.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
//         }

//         if (member.activeProfileId) {
//           const profileRef = doc(firestore, 'users', memberDoc.id, 'profiles', member.activeProfileId);
//           // Push a promise that resolves to both the member and their profile data
//           profilePromises.push(getDoc(profileRef).then(profileSnapshot => ({ member, profileSnapshot })));
//         } else {
//           members.push({ ...member, id: memberDoc.id });
//         }
        
//         // if (!member.isTeamMaster) {
//         //   members.push({ ...(member), id: memberDoc.id });
//         // }
//       });

//       // Resolve all profile fetch promises
//       const profilesResults = await Promise.all(profilePromises);
//       profilesResults.forEach(({ member, profileSnapshot }) => {
//         if (profileSnapshot.exists()) {
//           const profileData = profileSnapshot.data() as ProfileDataType;
//           members.push({
//             ...member,
//             id: member.id,
//             addedToContacts: profileData.addedToContacts,
//             contactsCount: profileData.contacts,
//             // Include other data from profile as needed
//           });
//         }
//       });

//       // Query for unused invitations in the batch
//       const invitationsQuery = query(
//         collection(firestore, 'batches', batchId, 'invitations'),
//         where('used', '==', false)
//       );
//       const invitationsSnapshot = await getDocs(invitationsQuery);

//       // Collect invitations data
//       const unusedInvitations: InvitationData[] = [];
//       invitationsSnapshot.forEach((doc) => {
//         const invitation = doc.data() as InvitationData;
//         if (invitation.expirationDate && typeof invitation.expirationDate !== 'string') {
//           const timestamp = invitation.expirationDate as unknown as Timestamp;
//           invitation.expirationDate = new Date(timestamp.seconds * 1000);
//         }
//         unusedInvitations.push({ ...invitation, id: doc.id });
//       });

//       // Resolve with both users and unused invitations
//       resolve({
//         success: true,
//         data: {
//           members,
//           unusedInvitations,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       reject({ success: false, data: { members: [], unusedInvitations: [] }, error: (error as Error).message });
//     }
//   });
// }

export const getTeam = (
  batchId: string
): Promise<{
  success: boolean;
  data: { members: UserType[]; unusedInvitations: InvitationData[] };
  error?: string;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const membersQuery = query(
        collection(firestore, 'users'),
        where('batchId', '==', batchId)
      );
      const membersSnapshot = await getDocs(membersQuery);

      const members: UserType[] = [];

      for (const memberDoc of membersSnapshot.docs) {
        const member = memberDoc.data() as UserType;
        if (member.createdOn && typeof member.createdOn !== 'string') {
          const createdOnTimestamp = member.createdOn as unknown as Timestamp;
          member.createdOn = new Date(createdOnTimestamp.seconds * 1000);
        }
        if (member.lastLogin && typeof member.lastLogin !== 'string') {
          const lastLoginTimestamp = member.lastLogin as unknown as Timestamp;
          member.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
        }

        member.id = memberDoc.id;

        if (member.activeProfileId) {
          const profileRef = doc(firestore, 'users', memberDoc.id, 'profiles', member.activeProfileId);
          const profileSnapshot = await getDoc(profileRef);

          if (profileSnapshot.exists()) {
            const profileData = profileSnapshot.data() as ProfileDataType;
            member.addedToContacts = profileData.addedToContacts;
            member.contactsCount = profileData.contacts;
          }
        }

        members.push(member);
      }

      // Query for unused invitations in the batch
      const invitationsQuery = query(
        collection(firestore, 'batches', batchId, 'invitations'),
        where('used', '==', false)
      );
      const invitationsSnapshot = await getDocs(invitationsQuery);

      // Collect invitations data
      const unusedInvitations: InvitationData[] = [];
      invitationsSnapshot.forEach((doc) => {
        const invitation = doc.data() as InvitationData;
        if (invitation.expirationDate && typeof invitation.expirationDate !== 'string') {
          const timestamp = invitation.expirationDate as unknown as Timestamp;
          invitation.expirationDate = new Date(timestamp.seconds * 1000);
        }
        unusedInvitations.push({ ...invitation, id: doc.id });
      });

      resolve({
        success: true,
        data: { members, unusedInvitations },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      reject({ success: false, data: { members: [], unusedInvitations: [] }, error: (error as Error).message });
    }
  });
};

// export const getTeamMembers = (
//   batchId: string
// ): Promise<{
//   success: boolean;
//   members: UserType[];
//   error?: string;
// }> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Query for users belonging to the batch
//       const membersQuery = query(
//         collection(firestore, 'users'),
//         where('batchId', '==', batchId)
//       );
//       const membersSnapshot = await getDocs(membersQuery);

//       // Collect members data
//       const members: UserType[] = [];
//       membersSnapshot.forEach((doc) => {
//         const member = doc.data() as UserType;
//         if (member.createdOn && typeof member.createdOn !== 'string') {
//           const createdOnTimestamp = member.createdOn as unknown as Timestamp;
//           member.createdOn = new Date(createdOnTimestamp.seconds * 1000);
//         }
//         if (member.lastLogin && typeof member.lastLogin !== 'string') {
//           const lastLoginTimestamp = member.lastLogin as unknown as Timestamp;
//           member.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
//         }
//         members.push({ ...(member), id: doc.id });
//       });

//       // Sort members so that isTeamMaster: true comes first
//       members.sort((a, b) => {
//         if (a.isTeamMaster && !b.isTeamMaster) {
//           return -1;
//         }
//         if (!a.isTeamMaster && b.isTeamMaster) {
//           return 1;
//         }
//         return 0;
//       });

//       // Resolve with both users and unused invitations      
//       resolve({
//         success: true,
//         members,
//       });
//     } catch (error) {
//       console.log(error);
      
//       console.error("Error fetching data:", error);
//       reject({ success: false, members: [], error: (error as Error).message });
//     }
//   });
// };

export const getTeamMembers = (batchId: string): Promise<{
  success: boolean;
  members: UserType[];
  error?: string;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const membersQuery = query(
        collection(firestore, 'users'),
        where('batchId', '==', batchId)
      );
      const membersSnapshot = await getDocs(membersQuery);

      const members: UserType[] = [];
      const profilePromises: Promise<DocumentSnapshot<DocumentData>>[] = [];

      membersSnapshot.forEach(memberDoc => {
        const member = memberDoc.data() as UserType;
        // Date conversion as per your structure
        if (member.createdOn && typeof member.createdOn !== 'string') {
          const createdOnTimestamp = member.createdOn as unknown as Timestamp;
          member.createdOn = new Date(createdOnTimestamp.seconds * 1000);
        }
        if (member.lastLogin && typeof member.lastLogin !== 'string') {
          const lastLoginTimestamp = member.lastLogin as unknown as Timestamp;
          member.lastLogin = new Date(lastLoginTimestamp.seconds * 1000);
        }

        if (member.activeProfileId) {
          const profileRef = doc(firestore, 'users', memberDoc.id, 'profiles', member.activeProfileId);
          profilePromises.push(getDoc(profileRef));
        }

        members.push({ ...member, id: memberDoc.id });
      });

      const profileDocs = await Promise.all(profilePromises);
      profileDocs.forEach((profileDoc, index) => {
        if (profileDoc.exists()) {
          const profileData = profileDoc.data() as ProfileDataType;
          members[index].addedToContacts = profileData.addedToContacts;
          members[index].contactsCount = profileData.contacts;
        }
      });

      members.sort((a, b) => (a.isTeamMaster && !b.isTeamMaster) ? -1 : (!a.isTeamMaster && b.isTeamMaster) ? 1 : 0);

      resolve({
        success: true,
        members,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      reject({ success: false, members: [], error: (error as Error).message });
    }
  });
};

export const fetchTeamLinks = async (teamId: string): Promise<{ success: boolean, data?: { social: LinkType[], custom: LinkType[] }, error?: string }> => {
  try {
    const teamLinksRef = collection(firestore, `teams/${teamId}/links`);
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), 5000));
    const linksSnapshot = await Promise.race([getDocs(teamLinksRef), timeout]) as QuerySnapshot;

    const socialLinks: LinkType[] = [];
    const customLinks: LinkType[] = [];

    linksSnapshot.docs.forEach(doc => {
      const link = { id: doc.id, ...doc.data() } as LinkType;
      if (link.isSocial) {
        socialLinks.push(link);
      } else {
        customLinks.push(link);
      }
    });

    return { success: true, data: { social: socialLinks, custom: customLinks }};
  } catch (error) {
    console.error('Error fetching team links:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      console.error('An unknown error occurred:', error);
      return { success: false, error: 'An unknown error occurred' };
    }
  }
};

export const deleteTeamById = async (id: string): Promise<boolean> => {
  try {
    const batchDoc = doc(firestore, 'teams', id);
    await deleteDoc(batchDoc);
    return true;
  } catch (error) {
    console.error("Error deleting team:", error);
    return false;
  }
};

// export const updateTeamProfileBasicInfo = (teamId: string, basicInfoData: BasicInfoFormDataTypes) => {
//   return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
//       const teamRef = doc(firestore, 'teams', teamId);

//       const unsubscribe = onSnapshot(teamRef, (doc) => {
//           if (doc.metadata.hasPendingWrites) {
//               console.log("Data is being written...");
//           }

//           if (doc.metadata.fromCache) {
//               console.log("Data came from cache.");
//               unsubscribe(); 
//               resolve({ success: true });
//           } else {
//               console.log("Data came from the server.");
//           }

//           if (!doc.metadata.hasPendingWrites && !doc.metadata.fromCache) {
//               // Assuming that once data is not from cache and has no pending writes,
//               // it's successfully updated on the server.
//               unsubscribe(); // Important: Stop listening to changes.
//               resolve({ success: true });
//           }
//       }, (error) => {
//           // This is called if there's an error with the snapshot listener
//           console.error("Snapshot error:", error);
//           unsubscribe();
//           reject({ success: false, error: error.message });
//       });

//       // Attempt to update the document
//       updateDoc(teamRef, { basicInfoData }).catch(error => {
//           console.error("Error updating team basic info:", error);
//           unsubscribe();  // Important: Stop listening to changes if there's an error.
//           reject({ success: false, error: error.message });
//       });
//   });
// };

export const updateTeamTitleData = async (
  teamId: string,
  newTitle: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const teamRef = doc(firestore, 'teams', teamId);
    const batchRef = doc(firestore, 'batches', teamId);

    await updateDoc(teamRef, { title: newTitle });

    // Check if the batch document exists and update it as well
    const batchSnapshot = await getDoc(batchRef);
    if (batchSnapshot.exists()) {
      await updateDoc(batchRef, { title: newTitle });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating team title:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateTeamProfileBasicInfo = (teamId: string, basicInfoData: BasicInfoFormDataTypes) => {
  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const teamRef = doc(firestore, 'teams', teamId);

    // Get the local version
    const localVersion = parseInt(getLocalVersion() || '1');
    const newVersion = localVersion === 1 ? 2 : 1;

    const unsubscribe = onSnapshot(teamRef, (doc) => {
        if (doc.metadata.hasPendingWrites) {
            console.log("Data is being written...");
        }

        if (doc.metadata.fromCache) {
            console.log("Data came from cache.");
            unsubscribe();
            resolve({ success: true });
        } else {
            console.log("Data came from the server.");
        }

        if (!doc.metadata.hasPendingWrites && !doc.metadata.fromCache) {
            unsubscribe(); // Stop listening to changes.
            resolve({ success: true });
        }
    }, (error) => {
        console.error("Snapshot error:", error);
        unsubscribe();
        reject({ success: false, error: error.message });
    });

    // Update the document with new basic info and version
    updateDoc(teamRef, { basicInfoData, version: newVersion }).then(() => {
        // Update the local version after successful update
        updateLocalVersion(newVersion.toString());
    }).catch(error => {
        console.error("Error updating team basic info:", error);
        unsubscribe();
        reject({ success: false, error: error.message });
    });
  });
};

export const updateTeamAboutInfo = async (teamId: string, aboutData: AboutFormDataTypes) => {
  const teamRef = doc(firestore, 'teams', teamId);
  // Get the local version
  const localVersion = parseInt(getLocalVersion() || '1');
  const newVersion = localVersion === 1 ? 2 : 1;
  // Start the write operation
  updateDoc(teamRef, { aboutData, version: newVersion }).then(() => {
    // Update the local version after successful update
    updateLocalVersion(newVersion.toString());
  }).catch(error => {
    console.error("Error updating team about info:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
      const unsubscribe = onSnapshot(teamRef, (doc) => {
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

export const updateTeamContactForm = async (teamId: string, contactFormData: ContactFormType) => {
  const teamRef = doc(firestore, 'teams', teamId);
  const localVersion = parseInt(getLocalVersion() || '1');
  const newVersion = localVersion === 1 ? 2 : 1;
  // Start the write operation
  updateDoc(teamRef, { contactFormData, version: newVersion }).then(() => {
    // Update the local version after successful update
    updateLocalVersion(newVersion.toString());
  }).catch(error => {
    console.error("Error updating team contact form:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const unsubscribe = onSnapshot(teamRef, (doc) => {
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

export const updateTeamThemeSettings = async (
  teamId: string, 
  themeSettings: ThemeSettingsType, 
  favoriteColors: ColorType[]
) => {
  const teamRef = doc(firestore, 'teams', teamId);
  const localVersion = parseInt(getLocalVersion() || '1');
  const newVersion = localVersion === 1 ? 2 : 1;
  // Start the write operation
  updateDoc(teamRef, { themeSettings, favoriteColors, version: newVersion }).then(() => {
    // Update the local version after successful update
    updateLocalVersion(newVersion.toString());
  }).catch(error => {
    console.error("Error updating team theme settings:", error);
    // Handle the error or throw it for the outer function to catch
  });

  return new Promise<{ success: boolean, error?: string }>((resolve, reject) => {
    const unsubscribe = onSnapshot(teamRef, (doc) => {
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

export const updateTeamLinks = async (teamId: string, newLinks: any) => {
  const linksCollectionRef = collection(doc(firestore, 'teams', teamId), 'links');

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
    console.error("Error updating team links:", error);
    return { success: false, error: error.message };
  });

  return { success: true };
};

export const updateTeamCoverImage = async (
  teamId: string,
  newCoverImageData: { url: string | null, blob: Blob, base64: string }
) => {
  try {
    const teamRef = doc(firestore, 'teams', teamId);
    const localVersion = parseInt(getLocalVersion() || '1');
    const newVersion = localVersion === 1 ? 2 : 1;
    
    let coverImageResponse: { success: boolean, url?: string | null } = { success: false };

    // If there is a new image to upload
    if (newCoverImageData.blob && newCoverImageData.blob.size > 0) {
      coverImageResponse = await uploadImageToStorage(teamId, 'cover', `${teamId}.webp`, newCoverImageData.blob);
      if (!coverImageResponse.success) return coverImageResponse;
    } else {
      // If the image is being removed
      coverImageResponse = { success: true, url: null };
    }

    // Update the URLs in the team document
    await updateDoc(teamRef, {
      coverImageData: {
        url: coverImageResponse.url,
      },
      version: newVersion
    });

    updateLocalVersion(newVersion.toString());

    return { success: true };
  } catch (error) {
    console.error("Error updating cover image:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const getAllTeams = (): Promise<{ success: boolean; data: TeamDataType[]; error?: string }> => {
  return new Promise<{ success: boolean; data: TeamDataType[]; error?: string }>(async (resolve, reject) => {
    const teamsRef = query(collection(firestore, 'teams'));

    const handleSnapshot = (teamsSnapshot: QuerySnapshot) => {
      const teams: TeamDataType[] = [];

      if (teamsSnapshot.empty) {
        resolve({ success: true, data: [] });
      } else {
        teamsSnapshot.forEach(doc => {
          const data = doc.data();
          let createdOnDate = data.createdOn;
          
          if (createdOnDate && typeof createdOnDate !== 'string') {
            const createdOnTimestamp = createdOnDate as unknown as Timestamp;
            createdOnDate = new Date(createdOnTimestamp.seconds * 1000);
          }
          
          // Constructing team object with only required fields
          const team = {
            teamMasterId: data.teamMasterId,
            title: data.title,
            createdOn: createdOnDate,
            id: doc.id
          };

          teams.push(team);
        });
        resolve({ success: true, data: teams });
      }
    };

    try {
      // Try fetching from server first
      const teamsSnapshot = await getDocs(teamsRef);
      if (teamsSnapshot.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }
      handleSnapshot(teamsSnapshot);
    } catch (error) {
      console.error("Snapshot error:", error);
      reject({ success: false, data: [], error: (error as Error).message });
    }
  });
};

export const getTeamById = (teamId: string): Promise<{ success: boolean; data: TeamDataType[]; error?: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const teamRef = doc(firestore, 'teams', teamId);
      const teamSnapshot = await getDoc(teamRef);

      if (!teamSnapshot.exists()) {
        resolve({ success: true, data: [] }); // No team found, return empty array
      } else {
        const data = teamSnapshot.data();
        let createdOnDate = data.createdOn;
        
        if (createdOnDate && typeof createdOnDate !== 'string') {
          const createdOnTimestamp = createdOnDate as unknown as Timestamp;
          createdOnDate = new Date(createdOnTimestamp.seconds * 1000);
        }

        // Constructing team object with only required fields
        const team: TeamDataType = {
          teamMasterId: data.teamMasterId,
          title: data.title,
          createdOn: createdOnDate,
          id: teamSnapshot.id
        };

        resolve({ success: true, data: [team] }); // Wrap team data in an array
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      reject({ success: false, data: [], error: (error as Error).message });
    }
  });
};


