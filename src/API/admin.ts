import { firestore } from './firebaseConfig';
import { collection, query, getDocs, where } from '@firebase/firestore';

export const getAdminCounts = async (): Promise<{ usersCount: number; batchesCount: number; teamsCount: number; }> => {
  try {
    const usersRef = query(collection(firestore, 'users'), where('isAdmin', '!=', true));
    const batchesRef = query(collection(firestore, 'batches'));
    const teamsRef = query(collection(firestore, 'teams'));

    const [usersSnapshot, batchesSnapshot, teamsSnapshot] = await Promise.all([
      getDocs(usersRef),
      getDocs(batchesRef),
      getDocs(teamsRef),
    ]);

    return {
      usersCount: usersSnapshot.size,
      batchesCount: batchesSnapshot.size,
      teamsCount: teamsSnapshot.size,
    };
  } catch (error) {
    console.error("Error fetching admin counts:", error);
    throw new Error((error as Error).message);
  }
};