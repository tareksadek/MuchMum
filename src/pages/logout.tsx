import React, { useEffect } from 'react';
import { getAuth, signOut } from '@firebase/auth';
import { useRouter } from 'next/router';
import { RootState } from '@/store/reducers';
import { useSelector } from 'react-redux';

const Logout: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const profileUrl = user?.profileUrlSuffix

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push(`/${profileUrl}`);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }, [router, profileUrl]);

  return (
    <div>Logging you out...</div>
  );
}

export default Logout;
