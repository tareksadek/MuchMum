import { firestore } from './firebaseConfig';
import { doc, onSnapshot, getDoc } from '@firebase/firestore';

// export const fetchDefaultSetup = async () => {
//   try {
//     const docRef = doc(firestore, 'setup', 'defaultSetup');
//     const docSnapshot = await getDoc(docRef);

//     if (!docSnapshot.exists()) {
//       throw new Error('Document does not exist');
//     }

//     return {
//       success: true,
//       data: docSnapshot.data(),
//       fromCache: docSnapshot.metadata.fromCache
//     };
//   } catch (error) {
//     console.error("Error fetching default setup:", error);
//     return { success: false, error: (error as Error).message };
//   }
// };
function getLocalVersion() {
  return localStorage.getItem('setupVersion');
}

function updateLocalVersion(serverVersion: string) {
  localStorage.setItem('setupVersion', serverVersion.toString());
}

export const fetchDefaultSetup = async () => {
  try {
    const docRef = doc(firestore, 'setup', 'defaultSetup');
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error('Document does not exist');
    }

    const isOnline = navigator.onLine;
    const localVersion = getLocalVersion();
    const remoteVersion = docSnapshot.data().version;
    console.log(JSON.stringify(docSnapshot.data(), null, 4) );
    if (isOnline) {
      // console.log("Online mode detected.");
      
      if (Number(localVersion) === Number(remoteVersion)) {
        // console.log("Data fetched from cache (versions match).");
        // Logic to use cached data
        return {
          success: true,
          data: docSnapshot.data(),
          fromCache: true
        };
      } else {
        // console.log("Data fetched from server (version mismatch). Updating local version.");
        updateLocalVersion(remoteVersion);
        // Logic to use data from server
        return {
          success: true,
          data: docSnapshot.data(),
          fromCache: false
        };
      }
    } else {
      // console.log("Offline mode detected. Data fetched from cache.");
      // Logic to use cached data
      return {
        success: true,
        data: docSnapshot.data(),
        fromCache: true
      };
    }
  } catch (error) {
    console.error("Error fetching default setup:", error);
    return { success: false, error: (error as Error).message };
  }
};


export const checkFirestoreConnectivity = () => {
  return new Promise<boolean>((resolve, reject) => {
    const docRef = doc(firestore, 'setup', 'defaultSetup');
    
    const unsubscribe = onSnapshot(docRef, docSnapshot => {
      if (docSnapshot.metadata.fromCache) {
        console.log("Data came from cache.");
        resolve(false);
      } else {
        console.log("Data came from the server.");
        resolve(true);
      }
      
      unsubscribe(); // Stop listening after handling the initial snapshot.

    }, error => {
      console.error("Snapshot error:", error);
      reject(false); // Indicating offline in case of any error
      unsubscribe(); // Stop listening if there's an error.
    });
  });
};

export {};