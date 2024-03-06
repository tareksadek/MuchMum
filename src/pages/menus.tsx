import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  lazy,
  Suspense
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { LinkType } from '@/types/restaurant';
import { AppDispatch } from '@/store/reducers';
import { useRegisterSubmit, SubmitContext } from '@/contexts/SubmitContext';
import { fetchAllRestaurantMenus } from '@/store/reducers/restaurant';
import { useLayoutStyles } from '@/theme/layout';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import AppLayout from '@/layout/AppLayout';

const MenuCreator = lazy(() => import('@/components/Menu/MenuCreator'));

const Menus: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant, loadingRestaurant, restaurantMenus } = useSelector(restaurantSelector);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [links, setLinks] = useState<{ social: LinkType[], custom: LinkType[] }>({ social: [], custom: [] });

  const initialSocialLinksData = useRef<LinkType[]>(links.social);
  const initialCustomLinksData = useRef<LinkType[]>(links.custom);

  const checkIfLinksChanged = useCallback(() => {
    const socialLinksChanged = !_.isEqual(initialSocialLinksData.current, links.social);
    const customLinksChanged = !_.isEqual(initialCustomLinksData.current, links.custom);
    return { socialLinksChanged, customLinksChanged }
  }, [links]);

  const handleLinksSubmit = useCallback(() => {
    if (!userId || !currentUser) {
      return;
    }
    const linksChanged = checkIfLinksChanged();

    if (linksChanged.socialLinksChanged || linksChanged.customLinksChanged) {
      // dispatch(updateRestaurantLinks({userId, restaurantId: currentUser.activeRestaurantId, links}))
      setTimeout(() => setFormChanged(false), 3000)
    }
  }, [userId, currentUser, links, checkIfLinksChanged, dispatch, setFormChanged]);

  useEffect(() => {
    if (restaurant && restaurant.id && userId && !restaurantMenus) {
      dispatch(fetchAllRestaurantMenus({ userId, restaurantId: restaurant.id}))
    }
  }, [restaurant, userId, restaurantMenus, dispatch]);

  useEffect(() => {
    registerSubmit(handleLinksSubmit);
  }, [registerSubmit, handleLinksSubmit]);

  useEffect(() => {
    const linksChanged = checkIfLinksChanged();
    setFormValid(true)
    setFormChanged(linksChanged.socialLinksChanged || linksChanged.customLinksChanged);
  }, [checkIfLinksChanged, links, setFormChanged, setFormValid]);

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
          <MenuCreator
            setLinks={setLinks}
            menus={restaurant && restaurant.menus ? restaurant.menus : null}
            loading={loadingRestaurant}
          />
        </Suspense>
      </Box>
    </AppLayout>
  );
}

export default Menus;
