import { firestore } from './firebaseConfig';
import { Timestamp, QuerySnapshot, getDocs, deleteDoc, collection, doc, updateDoc, query, addDoc, orderBy, getDoc } from '@firebase/firestore';
import { InvitationData } from '../types/userInvitation';
// import { getBatchById } from './batch';
import { BatchData } from '../types/userInvitation';

// export const getInvitationFromBatchById = async (batchId: string, invitationId: string) => {
// 	try {
// 		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);
// 		const invitationDoc = await getDoc(invitationRef);

// 		if (invitationDoc.exists()) {
// 			const data = invitationDoc.data();
// 			if (data && data.expirationDate && typeof data.expirationDate !== 'string') {
// 				const timestamp = data.expirationDate as unknown as Timestamp;
// 				data.expirationDate = new Date(timestamp.seconds * 1000);
// 			}
// 			return {
// 				id: invitationDoc.id,
// 				...data
// 			};
// 		} else {
// 			return null;
// 		}
// 	} catch (error) {
// 		console.error("Error fetching invitation from batch by ID:", error);
// 		throw error;
// 	}
// };

// export const getInvitationFromBatchById = (batchId: string, invitationId: string): Promise<InvitationData | null> => {
// 	return new Promise<InvitationData | null>((resolve, reject) => {
// 		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);

// 		const unsubscribe = onSnapshot(invitationRef, docSnapshot => {
// 			if (docSnapshot.exists()) {
// 				const data = docSnapshot.data() as Partial<InvitationData>;
// 				if (data.expirationDate && typeof data.expirationDate !== 'string') {
// 					const timestamp = data.expirationDate as unknown as Timestamp;
// 					data.expirationDate = new Date(timestamp.seconds * 1000);
// 				}
// 				const result: InvitationData = {
// 					...data,
// 					id: docSnapshot.id
// 				} as InvitationData;
// 				// Once data is fetched, unsubscribe from further changes and resolve the promise
// 				unsubscribe();
// 				resolve(result);
// 			} else {
// 				// No data found, unsubscribe and resolve with null
// 				unsubscribe();
// 				resolve(null);
// 			}
// 		}, error => {
// 			console.error("Error fetching invitation from batch by ID:", error);
// 			reject(error); // if there's an error, reject the promise with that error
// 		});
// 	});
// };

export const getInvitationFromBatchById = async (batchId: string, invitationId: string): Promise<InvitationData | null> => {
  const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);

  try {
      const docSnapshot = await getDoc(invitationRef);

      if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Partial<InvitationData>;
          if (data.expirationDate && typeof data.expirationDate !== 'string') {
              const timestamp = data.expirationDate as unknown as Timestamp;
              data.expirationDate = new Date(timestamp.seconds * 1000);
          }

          const result: InvitationData = {
              ...data,
              id: docSnapshot.id
          } as InvitationData;

          return result;
      } else {
        return null;
      }
  } catch (error) {
      console.error("Error fetching invitation from batch by ID:", error);
      throw error;
  }
};


export const updateInvitation = async (batchId: string, invitationId: string, updatedData: any) => {
	try {
		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);
		await updateDoc(invitationRef, updatedData);
		return { success: true };
	} catch (error) {
		console.error("Error updating invitation:", error);
		return { success: false, error: (error as Error).message };
	}
};

// export const getAllInvitationsByBatchId = async (batchId: string): Promise<InvitationData[] | null> => {
// 	try {
// 		const invitationsQuery = query(
// 			collection(firestore, 'batches', batchId, 'invitations'),
// 			orderBy('used', 'desc')
// 		);
// 		const invitationSnapshot = await getDocs(invitationsQuery);

// 		const invitations: InvitationData[] = [];
// 		invitationSnapshot.forEach(doc => {
// 				const invitation = doc.data() as InvitationData;

// 				if (invitation.expirationDate && typeof invitation.expirationDate !== 'string') {
// 					const timestamp = invitation.expirationDate as unknown as Timestamp;
// 					invitation.expirationDate = new Date(timestamp.seconds * 1000);
// 				}

// 				if (invitation.usedOn && typeof invitation.usedOn !== 'string') {
// 					const timestamp = invitation.usedOn as unknown as Timestamp;
// 					invitation.usedOn = new Date(timestamp.seconds * 1000);
// 				}

// 		    invitations.push({
// 		        ...invitation,
// 						id: doc.id,
// 		    });
// 		});

// 		invitations.sort((a, b) => {
// 			if (a.used && !b.used) return -1;
// 			if (!a.used && b.used) return 1;
// 			return 0;
// 		});
// 		return invitations;
// 	} catch (error) {
// 		console.error("Error fetching invitations by batch ID:", error);
// 		return null;
// 	}
// };

export const getAllInvitationsByBatchId = (batchId: string): Promise<{ success: boolean; data: InvitationData[]; error?: string }> => {
  return new Promise<{ success: boolean; data: InvitationData[]; error?: string }>(async (resolve, reject) => {
    const invitationsQuery = query(
      collection(firestore, 'batches', batchId, 'invitations'),
      orderBy('used', 'desc')
    );

    const handleSnapshot = (snapshot: QuerySnapshot) => {
      const invitations: InvitationData[] = [];

      if (snapshot.empty) {
        resolve({ success: true, data: [] });
      } else {
        snapshot.forEach(doc => {
          const invitation = doc.data() as InvitationData;

          if (invitation.expirationDate && typeof invitation.expirationDate !== 'string') {
            const timestamp = invitation.expirationDate as unknown as Timestamp;
            invitation.expirationDate = new Date(timestamp.seconds * 1000);
          }

          if (invitation.usedOn && typeof invitation.usedOn !== 'string') {
            const timestamp = invitation.usedOn as unknown as Timestamp;
            invitation.usedOn = new Date(timestamp.seconds * 1000);
          }

          invitations.push({
            ...invitation,
            id: doc.id,
          });
        });

        invitations.sort((a, b) => {
          if (a.used && !b.used) return -1;
          if (!a.used && b.used) return 1;
          return 0;
        });

        resolve({ success: true, data: invitations });
      }
    };

    try {
      const snapshot = await getDocs(invitationsQuery);
      if (snapshot.metadata.fromCache) {
        console.log("Data came from cache.");
      } else {
        console.log("Data came from the server.");
      }
      handleSnapshot(snapshot);
    } catch (error) {
      console.error("Snapshot error:", error);
      reject({ success: false, data: [], error: (error as Error).message });
    }
  });
};

export const resetInvitationData = async (
	batchId: string,
	invitationId: string
): Promise<{ success: boolean; error?: string }> => {
	try {
		const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);

		await updateDoc(invitationRef, {
			used: false,
			usedOn: null,
			usedBy: null,
			connected: false
		});

		return { success: true };
	} catch (error) {
		console.error("Error resetting the invitation:", error);
		return { success: false, error: (error as Error).message };
	}
};

export const createInvitations = async (
  batch: BatchData | null,
  numberOfInvitations: number,
  shouldCreateMaster: boolean
): Promise<InvitationData[]> => {
  const createdInvitations: InvitationData[] = [];

  if (!batch || !batch.id) {
    throw new Error('Batch not found');
  }

  const invitationsCollection = collection(firestore, 'batches', batch.id, 'invitations');
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Set to one year from now

  let masterCreated = false;

  for (let i = 0; i < numberOfInvitations; i++) {
    const newInvitation: InvitationData = {
      used: false,
      usedOn: null,
      usedBy: null,
      connected: false,
      type: batch.isTeams ? 'teams' : 'default',
      isMaster: false,
      expirationDate: expirationDate.toISOString() // Convert Date to ISO string before saving
    };

    if (shouldCreateMaster && !masterCreated) {
      newInvitation.isMaster = true;
      masterCreated = true;
    }

    const docRef = await addDoc(invitationsCollection, {
      ...newInvitation,
      expirationDate: Timestamp.fromDate(expirationDate) // Save as Timestamp in Firestore
    });

    createdInvitations.push({
      ...newInvitation,
      id: docRef.id,
      expirationDate: expirationDate.toISOString() // Keep it as an ISO string in the returned object
    });
  }

  return createdInvitations;
};

export const deleteInvitation = async (batchId: string, invitationId: string): Promise<{ success: boolean; error?: string }> => {
  try {
      const invitationRef = doc(firestore, 'batches', batchId, 'invitations', invitationId);

      // Delete the document
      await deleteDoc(invitationRef);

      return { success: true };
  } catch (error) {
      console.error("Error deleting the invitation:", error);
      return { success: false, error: (error as Error).message };
  }
};

export { };
