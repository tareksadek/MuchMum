import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data: { email: string }, context: functions.https.CallableContext) => {
  // Check if the request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can add roles');
  }

  // Get the user by their email
  return admin.auth().getUserByEmail(data.email).then((user: admin.auth.UserRecord) => {
    // Set custom user claims
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made an admin.`
    };
  }).catch((error: Error) => {
    throw new functions.https.HttpsError('internal', error.message);
  });
});

const deleteSubcollection = async (parentRef: any, subcollectionName: string) => {
  const subcolRef = parentRef.collection(subcollectionName);
  const snapshot = await subcolRef.get();

  if (!snapshot.empty) {
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }
  }
};

const deleteProfilesAndSubcollections = async (userRef: any) => {
  const profilesColRef = userRef.collection('profiles');
  const profileSnapshot = await profilesColRef.get();

  for (const profileDoc of profileSnapshot.docs) {
    // Delete subcollections of each profile
    await deleteSubcollection(profileDoc.ref, 'profileImage');
    await deleteSubcollection(profileDoc.ref, 'links');
    await deleteSubcollection(profileDoc.ref, 'visits');

    // Delete the profile document itself
    await profileDoc.ref.delete();
  }
}

const deleteUserImagesFromStorage = async (userId: string) => {
  try {
    const userDirectory = `users/${userId}/`;
    const bucket = admin.storage().bucket(); // Use default bucket. Replace with bucket name string if you have a different bucket.

    const [files] = await bucket.getFiles({ prefix: userDirectory });

    const deletePromises = files.map(file => file.delete());
    await Promise.all(deletePromises);

  } catch (error) {
    console.error('Error while deleting user images from storage:', error);
    throw new Error('Failed to delete user images from storage.');
  }
}

const resetInvitationData = async (batchId: string, invitationId: string) => {
  const invitationRef = admin.firestore().doc(`batches/${batchId}/invitations/${invitationId}`);

  try {
    await invitationRef.update({
      used: false,
      usedOn: null,
      usedBy: null,
      connected: false
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting the invitation:", error);
    throw new functions.https.HttpsError('internal', (error as Error).message);
  }
};

exports.deleteUserData = functions.https.onCall(async (data, context) => {
  const userId = data.userId;

  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can delete user data.');
  }

  // Check if the user has the admin claim
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can delete user data.');
  }

  // 1. Delete the user from Firebase Authentication
  try {
    await admin.auth().deleteUser(userId);
  } catch (error) {
    console.error('Error deleting user from Firebase Authentication:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user from Firebase Authentication.');
  }

  const userRef = admin.firestore().doc(`users/${userId}`);

  // Delete profiles and their subcollections
  await deleteProfilesAndSubcollections(userRef);

  // Reset the invitation
  const batchSnapshot = await admin.firestore().collection('batches').where('usedBy', '==', userId).get();
  for (const batchDoc of batchSnapshot.docs) {
    const invitationsSnapshot = await batchDoc.ref.collection('invitations').where('usedBy', '==', userId).get();
    for (const invitationDoc of invitationsSnapshot.docs) {
      await resetInvitationData(batchDoc.id, invitationDoc.id);
    }
  }

  // Delete images from the storage
  await deleteUserImagesFromStorage(userId)

  // Finally, delete the main user document
  await userRef.delete();

  return { success: true };
});

exports.incrementVisitCounts = functions.firestore
  .document('users/{userId}/profiles/{profileId}/visits/{visitId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const profileId = context.params.profileId;

    // References
    const userRef = admin.firestore().doc(`users/${userId}`);
    const profileRef = admin.firestore().doc(`users/${userId}/profiles/${profileId}`);

    // Transaction to increment visit counts
    return admin.firestore().runTransaction(async (t) => {
      // Fetch the current values for both counts to check if they exist
      const userDoc = await t.get(userRef);
      const profileDoc = await t.get(profileRef);

      if (!userDoc.exists || !profileDoc.exists) {
        console.error("Documents do not exist");
        return;
      }

      let userVisits = userDoc.exists ? (userDoc.data()?.visits ?? 0) : 0;
      let profileVisits = profileDoc.exists ? (profileDoc.data()?.visits ?? 0) : 0;


      // Increment visits
      t.update(userRef, { visits: userVisits + 1 });
      t.update(profileRef, { visits: profileVisits + 1 });

      return "Visit counts incremented";
    });
  });

  exports.incrementContactsCounts = functions.firestore
  .document('users/{userId}/profiles/{profileId}/contacts/{contactId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const profileId = context.params.profileId;
    
    // Check for isUnique attribute from the snapshot of the created document
    const isUnique = snap.data().isUnique;
    if (!isUnique) {
        console.log("Contact is not unique. Skipping increment.");
        return null; // Exit the function without making any database updates
    }

    // References
    const profileRef = admin.firestore().doc(`users/${userId}/profiles/${profileId}`);

    // Transaction to increment contacts counts
    return admin.firestore().runTransaction(async (t) => {
      // Fetch the current values for both counts to check if they exist
      const profileDoc = await t.get(profileRef);

      if (!profileDoc.exists) {
        console.error("Profile document does not exist");
        return;
      }

      let profileContacts = profileDoc.exists ? (profileDoc.data()?.contacts ?? 0) : 0;

      // Increment contacts
      t.update(profileRef, { contacts: profileContacts + 1 });

      return "Contacts counts incremented";
    });
  });

exports.decrementContactsCounts = functions.firestore
  .document('users/{userId}/profiles/{profileId}/contacts/{contactId}')
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    const profileId = context.params.profileId;

    // References
    const profileRef = admin.firestore().doc(`users/${userId}/profiles/${profileId}`);

    // Transaction to decrement contacts counts
    return admin.firestore().runTransaction(async (t) => {
      // Fetch the current values for both counts to check if they exist
      const profileDoc = await t.get(profileRef);

      if (!profileDoc.exists) {
        console.error("Document does not exist");
        return;
      }

      let profileContacts = profileDoc.exists ? (profileDoc.data()?.contacts ?? 0) : 0;

      // Ensure we don't have a negative count
      if (profileContacts > 0) {
        // Decrement contacts
        t.update(profileRef, { contacts: profileContacts - 1 });
      } else {
        console.error("Contacts count already zero");
      }

      return "Contacts counts decremented";
    });
  });

  exports.deleteBatchInvitations = functions.firestore
  .document('batches/{batchId}')
  .onDelete(async (snap, context) => {
    const batchId = context.params.batchId;
    const invitationsCollection = admin.firestore().collection(`batches/${batchId}/invitations`);

    // Get all documents from the subcollection
    const invitationsSnapshot = await invitationsCollection.get();

    // Batched write to delete all documents
    const batch = admin.firestore().batch();
    invitationsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Commit the batched writes
    return batch.commit();
  });

  exports.deleteTeamLinks = functions.firestore
  .document('teams/{teamId}')
  .onDelete(async (snap, context) => {
    const teamId = context.params.teamId;
    const linksCollection = admin.firestore().collection(`teams/${teamId}/links`);

    // Get all documents from the subcollection
    const linksSnapshot = await linksCollection.get();

    // Batched write to delete all documents
    const batch = admin.firestore().batch();
    linksSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Commit the batched writes
    return batch.commit();
  });

  exports.createTeamDocument = functions.firestore
  .document('users/{userId}/profiles/{profileId}')
  .onCreate(async (snapshot, context) => {
    const { userId, profileId } = context.params;
    const userRef = admin.firestore().doc(`users/${userId}`);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data();

    if (userData && userData.isTeamMaster) {
      const batchId = userData.batchId;
      const batchTitle = userData.batchTitle || batchId;
      let { basicInfoData, ...profileData } = snapshot.data();

      // Extract only the needed attributes from basicInfoData
      const { address, location, organization } = basicInfoData || {};
      const filteredBasicInfoData = {
        ...(address && { address }),
        ...(location && { location }),
        ...(organization && { organization }),
      };

      // Prepare the data for the team document
      profileData = {
        ...profileData,
        basicInfoData: filteredBasicInfoData,
        title: batchTitle,
        teamMasterId: userId,
        version: 1,
      };

      delete profileData.profileImageData;

      const teamsRef = admin.firestore().collection('teams').doc(batchId);
      const linksRef = admin.firestore().collection(`users/${userId}/profiles/${profileId}/links`);

      try {
        await admin.firestore().runTransaction(async (transaction) => {
          const teamDocSnapshot = await transaction.get(teamsRef);
          if (!teamDocSnapshot.exists) {
            transaction.set(teamsRef, profileData); // Set the team document
          } else {
            console.log(`Team document with ID: ${batchId} already exists. No action taken.`);
          }
        });
  
        // After the transaction, copy the links if the team document was created
        const teamDocSnapshot = await teamsRef.get();
        const teamData = teamDocSnapshot.data() ?? {}; // Provide an empty object as fallback

        if (teamDocSnapshot.exists && !teamData.linksCopied) {
          const linksSnapshot = await linksRef.get();
          if (!linksSnapshot.empty) {
            const batch = admin.firestore().batch();
            linksSnapshot.docs.forEach((linkDoc) => {
              const teamLinksRef = teamsRef.collection('links').doc(linkDoc.id);
              batch.set(teamLinksRef, linkDoc.data());
            });
            await batch.commit();
            // Optionally mark the team document as having its links copied
            await teamsRef.update({ linksCopied: true });
          }
          console.log(`Team document with ID: ${batchId} created successfully with links.`);
        }
      } catch (error) {
        console.error("Error creating team document or copying links:", error);
      }
    } else {
      console.log(`User ${userId} is not a team master.`);
    }
  });







