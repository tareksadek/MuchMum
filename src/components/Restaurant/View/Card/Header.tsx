import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { placeHolderProfileImage } from '@/setup/setup';
import { useCardHeaderStyles } from '../styles';
import SocialLinks from '../SocialLinks';

const Header: React.FC = () => {
  const classes = useCardHeaderStyles()
  const setup = useSelector((state: RootState) => state.setup.setup);
  const restaurant = useSelector((state: RootState) => state.restaurant.restaurant);
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''

  let coverImage;

  if (setup && setup.coverImageData && setup.coverImageData.url) {
    coverImage = setup.coverImageData.url;
  } else if (restaurant && restaurant.coverImageData && restaurant.coverImageData.url) {
    coverImage = restaurant.coverImageData.url;
  }

  return (
    <Box width="100%" maxWidth={550} sx={classes.headerContainer}>
      <Box sx={classes.imagesContainer}>
        <Box
          sx={classes.coverImageContainer}
          maxWidth={550}
          minHeight={coverImage ? 'initial' : 200}
          width="100%"
          style={{
            // backgroundColor: coverImage ? 'transparent' : themeColorCode,
            background: coverImage ? `url(${coverImage}) no-repeat center top` : themeColorCode
          }}
        >
          {/* {coverImage && (
            <img src={coverImage} alt="Cover" />
          )} */}
          <Box
            sx={classes.cardContainer}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box
              sx={classes.profileImageContainer}
              width={106}
              height={106}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                src={restaurant && restaurant.profileImageData && restaurant.profileImageData.url ? restaurant.profileImageData.url : placeHolderProfileImage}
                alt={`${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} profile`}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <Box sx={classes.dataContainer} mt={1}>
              <Box>
                <Typography variant="h3" align="center">
                  {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.firstName ? restaurant.basicInfoData.firstName : ''}
                  {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.lastName ? ` ${restaurant.basicInfoData.lastName}` : ''}
                </Typography>
              </Box>
            </Box>
            {restaurant && restaurant.links && restaurant.links.social && restaurant.links.social.length > 0 && (
              <Box mt={1}>
                <SocialLinks
                  linksStyles={{
                    socialLinksStyle: 'rounded',
                    align: 'center',
                    size: 35
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
        
      </Box>
    </Box>
  );
};

export default Header;
