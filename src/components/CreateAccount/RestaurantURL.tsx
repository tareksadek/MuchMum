import React from 'react';
import { Typography, Box } from '@mui/material';
import { useRestaurantURLStyles } from './styles';
import { appDomainView } from '@/setup/setup';

interface RestaurantURLProps {
  profileUrl: string | null;
}

const RestaurantURL: React.FC<RestaurantURLProps> = ({ profileUrl }) => {
  const classes = useRestaurantURLStyles()

  return (
    <Box
      mt={2}
      mb={1}
      p={2}
      display="flex"
      alignItems="flex-start"
      gap={1}
      sx={classes.container}
    >
      <Typography variant="body1" sx={classes.url}>
        <b>Restaurant URL: </b>
      </Typography>
      <Box>
        <Typography variant="body1" sx={classes.url}>
          {profileUrl}
        </Typography>
        <Box sx={{ opacity: 0.75 }}>
          <Typography variant="body1" sx={classes.url}>
            EX: {`${appDomainView}/giovannis_pizzeria`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default RestaurantURL