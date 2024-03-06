import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import LoadingBackdrop from '@/components/Loading/LoadingBackdrop';
import AppLayout from '@/layout/AppLayout';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loadingAuth, isAdmin } = useAuth();
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      router.push('/Login');
    }
  }, [isLoggedIn, loadingAuth, router]);

  if (loadingAuth) {
    return (
      <AppLayout>
        <LoadingBackdrop 
          message="Signing you in, hang tight!"
          onComplete={() => true}
          cubed
        />
      </AppLayout>
    )
  }

  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
