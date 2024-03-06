import React, { useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Link } from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext';
import { ConnectivityProvider } from '@/contexts/ConnectivityContext';
import useAuth from '@/hooks/useAuth';

import AppContentContainer from './AppContentContainer';
import AppHeader from './AppHeader';
import AppSideMenu from './AppSideMenu';
import LoadingBackdrop from '@/components/Loading/LoadingBackdrop';
import Notification from '@/components/Notification/Notification';

import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import { setupSelector } from '@/store/selectors/setup';
import { RootState, AppDispatch } from '@/store/reducers';
import { openModal, closeModal } from '@/store/reducers/modal';
import { updateSetup } from '@/store/reducers/setup';
import { fetchUser } from '@/store/reducers/user';

import { StaticSetup, FetchedSetup, SetupType } from '@/types/setup';
import { defaults, main } from '@/setup/setup';

import { useAppStyles } from './appStyles';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useAppStyles();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); 
  const { setSpecificTheme } = useTheme(); 
  const { loadingAuth, isAdmin } = useAuth();
  const { isLoggedIn, currentUser, userId } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector)
  const { setup, loadingSetup } = useSelector(setupSelector);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);

  const isProfilePage = (!!currentUser && router.pathname.slice(1) === '[profileSuffix]');
  const isAdminDashboardPage = router.pathname === '/adminDashboard';
  const isSideMenuOpen = openModalName === 'sideMenu';

  const handlePopState = useCallback((event: PopStateEvent) => {
    if (openModalName) {
        dispatch(closeModal());
        event.preventDefault();
    }
  }, [openModalName, dispatch]);

  // useEffect(() => {
  //     if (openModalName) {
  //         window.history.pushState(null, "", window.location.pathname);
  //         window.addEventListener("popstate", handlePopState);
  //     }
  //     return () => {
  //         window.removeEventListener("popstate", handlePopState);
  //     };
  // }, [openModalName, handlePopState]);

  useEffect(() => {
    const handleBackButton = (event: any) => {
      if (isSideMenuOpen) {
        dispatch(closeModal());
        event.preventDefault(); // Prevent navigation
      }
    };
  
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [isSideMenuOpen, dispatch]);

  useEffect(() => {
    if (restaurant && restaurant.themeSettings) {            
      setSpecificTheme(restaurant.themeSettings.theme)
    }
  }, [restaurant]);

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      router.push('/Login');
    }
  }, [isLoggedIn, loadingAuth, router]);

  const toggleDrawer = useCallback(() => {
    console.log('lllll')
    console.log(isSideMenuOpen);
    
    if (isSideMenuOpen) {
      dispatch(closeModal());
    } else {
      dispatch(openModal('sideMenu'));
    }
  }, [dispatch, isSideMenuOpen]);

  useEffect(() => {
    const staticSetupData: SetupType = {
      ...defaults as StaticSetup,
      ...main as FetchedSetup
    };
    if (!setup && !loadingSetup) {
      console.log('fetching setup');
      
      dispatch(updateSetup(staticSetupData));
    }
  }, [dispatch, setup, loadingSetup]);

  useEffect(() => {
    // if ((userId && isLoggedIn && !currentUser && !loadingSetup) || (userId && !loadingSetup)) {
    if (
      (userId && isLoggedIn && !currentUser && !loadingSetup)
      // ||
      // (userId && restaurant && userId !== restaurant.userId && !loadingSetup)
      ) {
      dispatch(fetchUser(userId));
      console.log('fetching user');
    }
  }, [dispatch, isLoggedIn, currentUser, userId, loadingSetup]); 

  const shouldHideHeader = () => {
    const pagesWithoutHeader = ["/Login", "/CreateAccount", "/CreateRestaurant", "/ForgotPassword", "/Activate"];
    return pagesWithoutHeader.includes(router.pathname) || router.pathname === '/';
  };  

  if (loadingAuth) {
    return (
      <LoadingBackdrop 
        message="Signing you in, hang tight!"
        onComplete={() => true}
        cubed
      />
    )
  }
  
  return (
    <ConnectivityProvider>
      <Notification />
      <LoadingBackdrop cubed />
      <Box sx={classes.mainBox}>
        {!shouldHideHeader() && (
          <AppHeader
            userUrlSuffix={currentUser ? currentUser.profileUrlSuffix : null}
            isAdminDashboardPage={isAdminDashboardPage}
            isLoggedIn={isLoggedIn}
            onMenuButtonClick={toggleDrawer}
          />
        )}

        <AppContentContainer>
          {children}
          <Link
            href="https://contactdyn.com"
            target="_blank"
            sx={{
              textAlign: 'center',
              display: 'block',
              fontSize: '0.8rem',
              padding: '16px'
            }}
          >
            Powered By CDYN
          </Link>
        </AppContentContainer>

        <AppSideMenu
          isOpen={isSideMenuOpen}
          toggleDrawer={toggleDrawer}
        />
      </Box>
    </ConnectivityProvider>
  );
}

export default AppLayout;
