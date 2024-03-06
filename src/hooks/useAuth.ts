// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { setUser, clearUser } from '@/store/reducers/authUser';
import { fetchUser } from '@/store/reducers/user';
import { fetchSetup } from '@/store/reducers/setup';
import { RootState, AppDispatch } from '@/store/reducers';
import { setupSelector } from '@/store/selectors/setup';
import { authSelector } from '@/store/selectors/auth';

const useAuth = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { userId, isLoggedIn, currentUser } = useSelector(authSelector);
  const { setup, loadingSetup } = useSelector(setupSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = getAuth();
  
      const handleAuthChange = async (user: User | null) => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          setIsAdmin(!!idTokenResult.claims.admin);
          dispatch(setUser(user.uid));
        } else {
          setIsAdmin(false);
          dispatch(clearUser());
        }
        setLoadingAuth(false);
      };
  
      const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
  
      return () => unsubscribe();
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if (!setup && !loadingSetup) {
  //     console.log('fetching setup');
      
  //     dispatch(fetchSetup());
  //   }
  // }, [dispatch, setup, loadingSetup]);

  // console.log(isLoggedIn);
  // console.log('use auth');

  // useEffect(() => {
  //   // if ((userId && isLoggedIn && !currentUser && !loadingSetup) || (userId && !loadingSetup)) {
  //   if (
  //     (userId && isLoggedIn && !currentUser && !loadingSetup)
  //     // ||
  //     // (userId && restaurant && userId !== restaurant.userId && !loadingSetup)
  //     ) {
  //     dispatch(fetchUser(userId));
  //     console.log('fetching user');
  //   }
  // }, [dispatch, isLoggedIn, currentUser, userId, loadingSetup]);  

  return { loadingAuth, isAdmin };
};

export default useAuth;
