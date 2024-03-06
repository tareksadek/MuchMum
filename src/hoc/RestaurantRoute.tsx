import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import useAuth from '@/hooks/useAuth';
import LoadingBackdrop from '@/components/Loading/LoadingBackdrop';
import useUserData from '@/hooks/useUserData';
import { authSelector } from '@/store/selectors/auth';

interface RestaurantRouteProps {
  children: React.ReactElement;
}

const RestaurantRoute: React.FC<RestaurantRouteProps> = ({ children }) => {
  const { loadingAuth } = useAuth();
  const router = useRouter();
  const restaurantSuffix = router.query.profileSuffix as string;
  const { isLoggedIn, currentUser } = useSelector(authSelector);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      if (currentUser.isAdmin) {
        router.push('/AdminDashboard');
      } else {
        router.push(`/${currentUser.profileUrlSuffix}`);
      }
    }
  }, [isLoggedIn, currentUser]);

  useUserData(restaurantSuffix);

  if (loadingAuth) {
    return <LoadingBackdrop 
      message="Loading!" 
      onComplete={() => true}
      cubed
    />;
  }

  return children;
};

export default RestaurantRoute;