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
import { updateRestaurantLinks } from '@/store/reducers/restaurant';
import { useLayoutStyles } from '@/theme/layout';
import SaveButton from '@/layout/SaveButton';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import AppLayout from '@/layout/AppLayout';

const LinksCreator = lazy(() => import('@/components/Restaurant/LinksCreator'));

const Links: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
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
      dispatch(updateRestaurantLinks({userId, restaurantId: currentUser.activeRestaurantId, links}))
      setTimeout(() => setFormChanged(false), 3000)
    }
  }, [userId, currentUser, links, checkIfLinksChanged, dispatch, setFormChanged]);

  useEffect(() => {
    if (restaurant && restaurant.links) {
      setLinks(restaurant.links)
      initialSocialLinksData.current = restaurant.links.social;
      initialCustomLinksData.current = restaurant.links.custom;
    }
  }, [restaurant]);

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
          <LinksCreator
            setLinks={setLinks}
            links={links}
          />
        </Suspense>
          <Box
            sx={layoutClasses.stickyBottomBox}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <SaveButton
              onClick={handleLinksSubmit}
              text = "Save"
              disabled={!formValid || !formChanged}
            />
          </Box>
      </Box>
    </AppLayout>
  );
}

export default Links;
