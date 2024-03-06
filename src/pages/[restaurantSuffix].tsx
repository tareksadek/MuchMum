import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import { useRouter } from 'next/router'
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/reducers';
import { Box, CircularProgress, Alert } from '@mui/material';
import { fetchUserByRestaurantSuffix, updateUser } from '@/store/reducers/user';
import { updateRestaurant, fetchRestaurantLinks } from '@/store/reducers/restaurant'; 
import { updateSetup } from '@/store/reducers/setup';
import { logRestaurantVisit } from '@/API/restaurant';
import RestaurantRoute from '@/hoc/RestaurantRoute';
import { getUserByRestaurantSuffix } from '@/API/user';
import { fetchRestaurantById } from '@/API/restaurant';
import { wrapper } from '@/store/reducers';
import { UserType } from '@/types/user';
import { StaticSetup, FetchedSetup, SetupType } from '@/types/setup';
import { RestaurantDataType } from '@/types/restaurant';
import RestaurantLayout from '@/layout/RestaurantLayout';
import { defaults, main, appDomain } from '@/setup/setup';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const restaurantSuffix = context.params?.restaurantSuffix as string;

    const userDataResponse = await getUserByRestaurantSuffix(restaurantSuffix);

    if (!userDataResponse.success) {
      throw new Error('Failed to fetch user data');
    }
    
    const formattedUserData = {
      ...userDataResponse.data,
      createdOn: userDataResponse.data.createdOn ? format(new Date(userDataResponse.data.createdOn), 'yyyy-MMM-dd') : null,
      lastLogin: userDataResponse.data.lastLogin ? format(new Date(userDataResponse.data.lastLogin), 'yyyy-MMM-dd') : null,
      redirect: userDataResponse.data.redirect || null
    };
    
    const restaurantDataResponse = await fetchRestaurantById(userDataResponse.data.id, userDataResponse.data.activeRestaurantId);
    if (!restaurantDataResponse.success) {
      throw new Error('Failed to fetch restaurant data');
    }

    return {
      props: {
        userData: formattedUserData,
        restaurantData: restaurantDataResponse.data,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        userData: null,
        restaurantData: null,
        error: (error instanceof Error) ? error.message : 'An error occurred',
      },
    };
  }
};

type RestaurantProps = {
  userData: UserType; 
  restaurantData: RestaurantDataType;
}

const Restaurant: React.FC<RestaurantProps> = ({ userData, restaurantData }) => {
  const router = useRouter();
  const user = userData
  const restaurant = restaurantData
  const restaurantSuffix = userData.profileUrlSuffix;
  
  const loadingUser = useSelector((state: RootState) => state.user.loading);
  const userError = useSelector((state: RootState) => state.user.error);
  const restaurantRedux = useSelector((state: RootState) => state.restaurant);
  const restaurantError = useSelector((state: RootState) => state.restaurant.error);
  const loggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = loggedIn && (authId === user?.id)

  const dispatch = useDispatch<AppDispatch>();

  const restaurantName = `${restaurantData?.basicInfoData?.firstName || ''} ${restaurantData?.basicInfoData?.lastName || ''}`;
  const restaurantDescription = `${restaurantData?.aboutData?.about || ''}`;
  const restaurantImage = restaurantData.profileImageData?.url || '/images/logo512.jpg';
  const restaurantPage = `${appDomain}/${userData.profileUrlSuffix}`

  // const shouldLogVisit = (profileId: string): boolean => {
  //   const lastVisit = localStorage.getItem(`visited_${profileId}`);
  //   if (lastVisit) {
  //     const ONE_DAY = 24 * 60 * 60 * 1000;
  //     const now = Date.now();
  //     if ((now - Number(lastVisit)) < ONE_DAY) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  // const markRestaurantAsVisited = (restaurantId: string) => {
  //   localStorage.setItem(`visited_${restaurantId}`, Date.now().toString());
  // };

  useEffect(() => {
    const staticSetupData: SetupType = {
      ...defaults as StaticSetup,
      ...main as FetchedSetup
    };
    if (user) {
      dispatch(updateSetup(staticSetupData))
      dispatch(updateUser(user));
    }
    if (user && restaurant) {
      dispatch(updateRestaurant(restaurant))
      // dispatch(fetchRestaurantLinks({ userId: user.id, restaurantId: user.activeRestaurantId }))
    }
  }, [dispatch, user, restaurant]);

  // useEffect(() => {
  //   if ((!loggedIn || !isAccountOwner) && user && restaurant && restaurant.id && shouldLogVisit(restaurant.id)) {
  //     logRestaurantVisit(user.id, restaurant.id);
  //     markRestaurantAsVisited(restaurant.id);
  //   }
  // }, [user, restaurant, loggedIn, isAccountOwner]);

  if (!user && !loadingUser && userError) {
    return (
      <Box mt={2}>
        <Alert severity="error">{userError}</Alert>
      </Box>
    )
  }

  if (!restaurant && restaurantError) {
    return (
      <Box mt={2}>
        <Alert severity="error">{restaurantError}</Alert>
      </Box>
    )
  }

  if (!user || !restaurant) {
    return (
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
    );
  }    

  if (restaurant) {
    return (
      <>
        <Head>
          <title>{restaurantName}</title>
          <meta name="description" content={restaurantDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={restaurantPage} />
          <meta property="og:title" content={restaurantName} />
          <meta property="og:description" content={restaurantDescription} />
          <meta property="og:image" content={restaurantImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={restaurantPage} />
          <meta name="twitter:title" content={restaurantName} />
          <meta name="twitter:description" content={restaurantDescription} />
          <meta name="twitter:image" content={restaurantImage} />
        </Head>
        <RestaurantLayout restaurant={restaurant} />
      </>
    );
  }
}

export default Restaurant;
