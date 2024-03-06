import React, { useEffect, ReactNode, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Link } from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext';

import AppContentContainer from './AppContentContainer';
import RestaurantHeader from './RestaurantHeader';
import AppSideMenu from './AppSideMenu';
import DefaultLayout from '@/components/Restaurant/View/Default/Layout';
import BusinessLayout from '@/components/Restaurant/View/Business/Layout';
import SocialLayout from '@/components/Restaurant/View/Social/Layout';
import CardLayout from '@/components/Restaurant/View/Card/Layout';

import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import { RootState, AppDispatch } from '@/store/reducers';
import { openModal, closeModal } from '@/store/reducers/modal';
import { RestaurantDataType } from '@/types/restaurant';
import useAuth from '@/hooks/useAuth';
import { fetchRestaurantLinks } from '@/store/reducers/restaurant';
import { useAppStyles } from './appStyles';

interface AppLayoutProps {
  restaurant: RestaurantDataType;
}

const RestaurantLayout: React.FC<AppLayoutProps> = ({ restaurant }) => {
  const classes = useAppStyles();
  const dispatch = useDispatch<AppDispatch>(); 
  const { setSpecificTheme } = useTheme(); 
  const { loadingAuth, isAdmin } = useAuth();
  const { restaurantLinks, loadingRestaurant } = useSelector(restaurantSelector);
  

  const { isLoggedIn } = useSelector(authSelector);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);

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
  }, [restaurant, setSpecificTheme]);

  useEffect(() => {
    if (restaurant.userId && restaurant.id) {
      dispatch(fetchRestaurantLinks({ userId: restaurant.userId, restaurantId: restaurant.id }))
    }
  }, [dispatch, restaurant]);

  const toggleDrawer = useCallback(() => {
    console.log('lllll')
    console.log(isSideMenuOpen);
    if (isSideMenuOpen) {
      dispatch(closeModal());
    } else {
      dispatch(openModal('sideMenu'));
    }
  }, [dispatch, isSideMenuOpen]);

  const getLayoutComponent = () => {
    switch (restaurant && restaurant.themeSettings && restaurant.themeSettings.layout) {
      case 'business':
        return <BusinessLayout restaurant={restaurant} restaurantLinks={restaurantLinks} loadingRestaurant={loadingRestaurant} />;
      case 'social':
        return <BusinessLayout restaurant={restaurant} restaurantLinks={restaurantLinks} loadingRestaurant={loadingRestaurant} />;
      case 'card':
        return <BusinessLayout restaurant={restaurant} restaurantLinks={restaurantLinks} loadingRestaurant={loadingRestaurant} />;
      default:
        return <BusinessLayout restaurant={restaurant} restaurantLinks={restaurantLinks} loadingRestaurant={loadingRestaurant} />;
    }
  };
  
  return (
    <Box sx={classes.mainBox}>
      <RestaurantHeader
        isLoggedIn={isLoggedIn}
        onMenuButtonClick={toggleDrawer}
      />

      <AppContentContainer>
        {getLayoutComponent()}
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
  );
}

export default RestaurantLayout;
