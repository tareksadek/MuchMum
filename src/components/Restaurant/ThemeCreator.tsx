import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { SocialIcon } from 'react-social-icons';
import { Button, Typography, Grid, Switch, Box, IconButton, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { lightTheme, darkTheme } from '@/theme/main';
import { themeColors, appDefaultTheme, appDefaultColor, appDefaultSocialLinksToSelectedColor } from '@/setup/setup';
import { DefaultLayoutIcon, BusinessLayoutIcon, CardLayoutIcon, SocialLayoutIcon, SunIcon, MoonIcon } from '@/layout/CustomIcons'
import { hexToRgb } from '@mui/material';
import { StyledSketchPicker } from './styles';
import { ThemeSettingsType, ColorType } from '@/types/restaurant';
import { useTheme } from '@/contexts/ThemeContext';
import { RootState, AppDispatch } from '@/store/reducers';
import { openModal, closeModal } from '@/store/reducers/modal';
import { useThemeStyles } from './styles';
import { useLayoutStyles } from '@/theme/layout';

type ThemeProps = {
  data: ThemeSettingsType;
  setData: React.Dispatch<React.SetStateAction<ThemeSettingsType>>;
  favoriteColors?: ColorType[] | null;
  setFavoriteColors?: React.Dispatch<React.SetStateAction<ColorType[]>> | null;
};

const ThemeCreator: React.FC<ThemeProps> = ({
  data,
  setData,
  favoriteColors,
  setFavoriteColors,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useThemeStyles()
  const layoutClasses = useLayoutStyles()
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [socialLinksToSelectedColor, setSocialLinksToSelectedColor] = useState<boolean>(appDefaultSocialLinksToSelectedColor);

  const { register } = useForm();
  const themeColor = selectedTheme && selectedTheme === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default
  // const dataThemeColor = data && data.theme  === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default
  const defaultThemeColor = appDefaultTheme === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default;

  const { setSpecificTheme, theme } = useTheme()

  // const currentThemeColor = selectedTheme ? themeColor : (data ? dataThemeColor : defaultThemeColor);
  const currentColor = selectedColorCode || data.selectedColor.code || appDefaultColor.code
  const currentTheme = selectedTheme || theme || data.theme || appDefaultTheme
  const currentThemeColor = currentTheme === 'dark' ? darkTheme.palette.background.default : lightTheme.palette.background.default
  const currentReverseThemeColor = currentTheme === 'dark' ? lightTheme.palette.background.default  : darkTheme.palette.background.default
  
  const layouts = [
    {
      name: 'default',
      icon: (
        <DefaultLayoutIcon
          background={currentThemeColor || defaultThemeColor}
          selectedColor={currentColor || appDefaultColor.code}
          reverse={currentReverseThemeColor}
        />
      ),
      label: 'Default'
    },
    {
      name: 'business',
      icon: (
        <BusinessLayoutIcon
          background={currentThemeColor || defaultThemeColor}
          selectedColor={currentColor || appDefaultColor.code}
          reverse={currentReverseThemeColor}
        />
      ),
      label: 'Business'
    },
    {
      name: 'card',
      icon: (
        <CardLayoutIcon
          background={currentThemeColor || defaultThemeColor}
          selectedColor={currentColor || appDefaultColor.code}
          reverse={currentReverseThemeColor}
        />
      ),
      label: 'Card'
    },
    {
      name: 'social',
      icon: (
        <SocialLayoutIcon
          background={currentThemeColor || defaultThemeColor}
          selectedColor={currentColor || appDefaultColor.code}
          reverse={currentReverseThemeColor}
        />
      ),
      label: 'Social'
    },
  ];

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isColorPickerModalOpen = openModalName === 'colorPicker';

  const combinedColors = useMemo(() => {
    const favorites = (favoriteColors || []).map(color => ({ name: 'custom', code: color.code }));

    if (favorites.length >= 6) {
      return favorites.slice(0, 6);
    }

    return [...favorites, ...themeColors.slice(0, 6 - favorites.length)];
  }, [favoriteColors]);

  useEffect(() => {
    if (data?.socialLinksToSelectedColor !== undefined) {
      setSocialLinksToSelectedColor(data.socialLinksToSelectedColor);
    }
  }, [data?.socialLinksToSelectedColor]);

  const handleSelectLayout = (layout: ThemeSettingsType['layout']) => {
    setData(prev => ({ ...prev, layout }));
  };

  const handleSelectTheme = (theme: ThemeSettingsType['theme']) => {
    setSelectedTheme(theme)
    setData(prev => ({ ...prev, theme }));
    setSpecificTheme(theme)
  };

  const handleSocialLinksToSelectedColor = () => {
    setSocialLinksToSelectedColor(prev => !prev)
    setData(prev => ({ ...prev, socialLinksToSelectedColor: !data.socialLinksToSelectedColor }));
  };

  const handleSaveColor = () => {
    if (selectedColorCode) {
      const newColor: ColorType = { name: 'custom', code: selectedColorCode };
      if (!favoriteColors?.find(color => color.code === newColor.code)) {
        setFavoriteColors?.((prevColors) => [...prevColors, newColor]);
      }
    }
    dispatch(closeModal())
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box mb={2}>
          <Typography variant="h4" align="center">Select Layout</Typography>
        </Box>
        <Grid container spacing={2} sx={classes.layoutContainer}>
          {layouts.map((layout) => (
            <Grid
              item
              key={layout.name}
              sx={classes.layoutItem}
            >
              <IconButton
                color={data.layout === layout.name ? 'primary' : 'default'}
                onClick={() => handleSelectLayout(layout.name as ThemeSettingsType['layout'])}
                {...register('layout')}
                sx={classes.layoutIcon}
              >
                {layout.icon}
              </IconButton>
              <Typography variant="body1" align="center">
                {layout.label}
              </Typography>
              {data.layout === layout.name && (
                <Box
                  sx={classes.selectedLayoutIconContainer}
                >
                  <CheckCircleIcon
                    sx={classes.selectedLayoutIcon}
                  />
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={4}>
        <Box mb={2}>
          <Typography variant="h4" align="center">Select Theme</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <Box
              onClick={() => handleSelectTheme('light')}
              sx={{
                ...classes.themeIconContainer,
                ...(currentTheme === 'light' && classes.themeSelectedIconContainer),
              }}
            >
              <SunIcon />
            </Box>
          </Grid>
          <Grid item>
            <Box
              onClick={() => handleSelectTheme('dark')}
              sx={{
                ...classes.themeIconContainer,
                ...(currentTheme === 'dark' && classes.themeSelectedIconContainer),
              }}
            >
              <MoonIcon />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Box mb={2}>
          <Typography variant="h4" align="center">Select Main Color</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {combinedColors.map((color) => (
            <Grid item key={color.code}>
              <Box
                sx={classes.colorItem}
                style={{
                  backgroundColor: color.code,
                }}
                onClick={() => {
                  if (typeof color.code === 'string') {
                    setSelectedColorCode(color.code);
                    setData(prev => ({ ...prev, selectedColor: color }));
                  }
                }}
              >
                {currentColor === color.code && <CheckIcon style={{ color: '#fff' }} />}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <Button
            onClick={() => dispatch(openModal('colorPicker'))}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Pick Color
          </Button>
        </Box>
      </Box>

      <Box mt={4}>
        <Box mb={2}>
          <Typography variant="h4" align="center">Social icons color</Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={2}
        >
          <Typography variant="body1">Match icons color to selected color:</Typography>
          <Switch
            checked={socialLinksToSelectedColor}
            onChange={() => handleSocialLinksToSelectedColor()}
          />
        </Box>

        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            item
          >
            <SocialIcon
              network="facebook"
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ height: 45, width: 45 }}
              bgColor={socialLinksToSelectedColor ? currentColor : undefined}
            />
          </Grid>
          <Grid
            item
          >
            <SocialIcon
              network="linkedin"
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ height: 45, width: 45 }}
              bgColor={socialLinksToSelectedColor ? currentColor : undefined}
            />
          </Grid>
          <Grid
            item
          >
            <SocialIcon
              network="google"
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{ height: 45, width: 45 }}
              bgColor={socialLinksToSelectedColor ? currentColor : undefined}
            />
          </Grid>
        </Grid>
      </Box>


      <Drawer
        anchor="bottom"
        open={isColorPickerModalOpen}
        onClose={() => dispatch(closeModal())}
        sx={layoutClasses.radiusBottomDrawer}
      >
        <StyledSketchPicker
          color={selectedColorCode ? hexToRgb(selectedColorCode) : { r: 255, g: 255, b: 255, a: 1 }}
          onChangeComplete={(color) => {
            setSelectedColorCode(color.hex);
            setData(prev => ({ ...prev, selectedColor: { name: 'picker', code: color.hex } }));
          }}
          styles={{
            default: {
              picker: {
                width: '100%',
                boxShadow: 'none',
                padding: 0,
                margin: 0,
                borderRadius: 0,
              }
            }
          }}
        />
        <Box p={2}>
          <Button
            onClick={handleSaveColor}
            variant="contained"
            color="primary"
            fullWidth
          >
            Add Color
          </Button>
        </Box>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButton}
          onClick={() => dispatch(closeModal())}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Box>
  );
};

export default ThemeCreator;
