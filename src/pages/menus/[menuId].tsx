import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  lazy,
  Suspense
} from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Chip } from '@mui/material';
import { LinkType } from '@/types/restaurant';
import { AppDispatch } from '@/store/reducers';
import { useRegisterSubmit, SubmitContext } from '@/contexts/SubmitContext';
import { fetchAllRestaurantMenus } from '@/store/reducers/restaurant';
import { fetchRestaurantMenu } from '@/store/reducers/menu';
import { useLayoutStyles } from '@/theme/layout';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import AppLayout from '@/layout/AppLayout';

const MenuItemsCreator = lazy(() => import('@/components/Menu/MenuItemsCreator'));

const Menu: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant, loadingRestaurant, restaurantMenus } = useSelector(restaurantSelector);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid } = context;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menuId } = router.query; 

  const [links, setLinks] = useState<{ social: LinkType[], custom: LinkType[] }>({ social: [], custom: [] });

  useEffect(() => {
    if (restaurant && restaurant.id && userId && !restaurantMenus) {
      dispatch(fetchAllRestaurantMenus({ userId, restaurantId: restaurant.id}))
    }
  }, [restaurant, userId, restaurantMenus, dispatch]);

  useEffect(() => {
    if (userId && restaurant && restaurant.id && menuId && typeof menuId === 'string') {
      dispatch(fetchRestaurantMenu({ userId, restaurantId: restaurant.id, menuId }));
    }
  }, [userId, restaurant, menuId, dispatch]);

  return (
    <AppLayout>
      <Box p={2}>
        <Suspense
          fallback={(
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              p={2}  
            >
              <Typography align='center' variant='body1'>Loading...</Typography>
            </Box>
          )}
        >
          <MenuItemsCreator />
        </Suspense>
      </Box>
    </AppLayout>
  );
}

export default Menu;
