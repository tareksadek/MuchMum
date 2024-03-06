import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { placeHolderProfileImage } from '@/setup/setup';
import { useSocialHeaderStyles } from '../styles';
import { RestaurantDataType } from '@/types/restaurant';

type HeaderProps = {
  restaurant: RestaurantDataType;
}

const Header: React.FC<HeaderProps> = ({ restaurant }) => {
  const classes = useSocialHeaderStyles()
  const setup = useSelector((state: RootState) => state.setup.setup);
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''

  return (
    <Box width="100%" maxWidth={550} sx={classes.headerContainer}>
      <Box sx={classes.imagesContainer}>
        <Box
          sx={classes.coverImageContainer}
          maxWidth={550}
          minHeight={250}
          width="100%"
          style={{
            backgroundColor: themeColorCode,
          }}
        >
          <img
            src={restaurant && restaurant.profileImageData && restaurant.profileImageData.url ? restaurant.profileImageData.url : placeHolderProfileImage}
            alt={`${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} restaurant`}
          />
        </Box>
        <Box
          sx={classes.cardContainer}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box sx={classes.dataContainer} mt={1}>
            <Box>
              <Typography variant="h3" align="center">
                {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.firstName ? restaurant.basicInfoData.firstName : ''}
                {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.lastName ? ` ${restaurant.basicInfoData.lastName}` : ''}
              </Typography>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Header;
