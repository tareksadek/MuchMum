import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import useAuth from '@/hooks/useAuth';

interface GuestRouteProps {
  children: React.ReactElement;
  redirectTo?: string;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children, redirectTo }) => {
  const { loadingAuth } = useAuth();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      if (currentUser.isAdmin) {
        router.push('/AdminDashboard');
      } else {
        router.push(`/${currentUser.profileUrlSuffix}`);
      }
    }
  }, [isLoggedIn, currentUser, router]);

  if (loadingAuth) {
    return null
  }

  return children;
};

export default GuestRoute;