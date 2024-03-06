import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { setUser, clearUser } from '@/store/reducers/authUser';
import { startLoading, stopLoading } from '@/store/reducers/loadingCenter';
import { AppDispatch } from '@/store/reducers';

export const listenToAuthState = () => (dispatch: AppDispatch) => {
  const auth = getAuth();

  dispatch(startLoading('Loading auth user...'));
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser(user.uid));
    } else {
      dispatch(clearUser());
    }
    dispatch(stopLoading());
  });
};
