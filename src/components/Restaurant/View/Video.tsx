import React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { RestaurantDataType } from '@/types/restaurant';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

type VideoProps = {
  restaurant: RestaurantDataType;
}

const Video: React.FC<VideoProps> = ({ restaurant }) => {
  if (restaurant && restaurant.aboutData && restaurant.aboutData.videoUrl) {
    return (
      <Box width="100%">
        <ReactPlayer url={restaurant.aboutData.videoUrl} width="100%" controls playing={false} />
      </Box>
    );
  }
  return null
};

export default React.memo(Video);
