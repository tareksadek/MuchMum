import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  lazy,
  Suspense
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { ThemeSettingsType, ColorType } from '@/types/restaurant';
import {
  appDefaultTheme,
  appDefaultColor,
  appDefaultLayout,
  appDefaultSocialLinksToSelectedColor,
} from '@/setup/setup';
import { RootState, AppDispatch } from '@/store/reducers';
import { useRegisterSubmit, SubmitContext } from '@/contexts/SubmitContext';
import { updateThemeSettingsData } from '@/store/reducers/restaurant';
import { useLayoutStyles } from '@/theme/layout';
import SaveButton from '@/layout/SaveButton';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import AppLayout from '@/layout/AppLayout';

const ThemeCreator = lazy(() => import('@/components/Restaurant/ThemeCreator'));

const Theme: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType>({
    selectedColor: appDefaultColor,
    theme: appDefaultTheme,
    layout: appDefaultLayout,
    socialLinksToSelectedColor: appDefaultSocialLinksToSelectedColor
  });
  const [favoriteColors, setFavoriteColors] = useState<ColorType[]>([]);

  const initialThemeData = useRef<ThemeSettingsType>(themeSettings);

  const checkIfThemeChanged = useCallback(() => {
    const themeChanged = !_.isEqual(initialThemeData.current, themeSettings);
    return themeChanged
  }, [themeSettings]);

  const handleThemeSubmit = useCallback(() => {
    if (!userId || !currentUser) {
      return;
    }
    const themeChanged = checkIfThemeChanged();

    if (themeChanged) {
      dispatch(updateThemeSettingsData({userId, restaurantId: currentUser.activeRestaurantId, themeSettings, favoriteColors}))
      setTimeout(() => setFormChanged(false), 3000)
    }

  }, [userId, currentUser, checkIfThemeChanged, dispatch, themeSettings, favoriteColors, setFormChanged]);

  useEffect(() => {
    if (restaurant && restaurant.themeSettings) {
      setThemeSettings(restaurant.themeSettings)
      initialThemeData.current = restaurant.themeSettings;
    }
    if (restaurant && restaurant.favoriteColors) {
      setFavoriteColors(restaurant.favoriteColors)
    }
  }, [restaurant]);

  useEffect(() => {
    registerSubmit(handleThemeSubmit);
  }, [registerSubmit, handleThemeSubmit]);

  useEffect(() => {
    const themeChanged = checkIfThemeChanged();
    setFormValid(true)
    setFormChanged(themeChanged);
  }, [checkIfThemeChanged, setFormChanged, setFormValid]);

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
          <ThemeCreator
            data={themeSettings}
            setData={setThemeSettings}
            favoriteColors={favoriteColors}
            setFavoriteColors={setFavoriteColors}
          />
        </Suspense>
        <Box
          sx={layoutClasses.stickyBottomBox}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <SaveButton
            onClick={handleThemeSubmit}
            text = "Save"
            disabled={!formValid || !formChanged}
          />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Theme;
