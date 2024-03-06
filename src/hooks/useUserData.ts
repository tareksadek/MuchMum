import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, fetchUserByRestaurantSuffix } from '@/store/reducers/user';
import { AppDispatch } from '../store/reducers';
import { authSelector } from '@/store/selectors/auth';
import { setupSelector } from '@/store/selectors/setup';

const useUserData = (restaurantSuffix?: string) => {
  const { setup, loadingSetup } = useSelector(setupSelector);
  const { userId, isLoggedIn, currentUser } = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();

  const [isUserFetched, setIsUserFetched] = useState(false);
  
//   useEffect(() => {
//   // Fetch setup data only if it's not already fetched or being fetched.
//   if (!appSetup && !loadingSetup) {
//     dispatch(fetchSetup());
//   }
// }, [appSetup, loadingSetup, dispatch]);

useEffect(() => {
  if (setup && !currentUser && !isUserFetched) {
    setIsUserFetched(true);
    if (isLoggedIn && userId && !restaurantSuffix) {
      dispatch(fetchUser(userId));
    } else if (restaurantSuffix) {      
      dispatch(fetchUserByRestaurantSuffix({restaurantSuffix}));
    }
  }
}, [setup, currentUser, isLoggedIn, userId, restaurantSuffix, dispatch, isUserFetched]);
};

export default useUserData;
