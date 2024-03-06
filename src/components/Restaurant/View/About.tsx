import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RootState } from '@/store/reducers';
import { RestaurantDataType } from '@/types/restaurant';

type AboutProps = {
  restaurant: RestaurantDataType;
}

const About: React.FC<AboutProps> = ({ restaurant }) => {
  const setup = useSelector((state: RootState) => state.setup.setup);

  let aboutData;

  if (setup && setup.aboutData && setup.aboutData.about) {
    aboutData = setup.aboutData.about;
  } else if (restaurant && restaurant.aboutData && restaurant.aboutData.about) {
    aboutData = restaurant.aboutData.about;
  }

  if (aboutData) {
    return (
      <Box pl={1} pr={1}>
        <Typography variant="body1" align="center" style={{ fontSize: '0.75rem', lineHeight: '1.4rem' }}>
          {aboutData}
        </Typography>
      </Box>
    );
  }
  return null
};

export default About;
