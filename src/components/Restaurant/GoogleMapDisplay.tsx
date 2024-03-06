import React, { useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_KEY } from '../../setup/setup';
import { useMapStyles } from './styles';

type MarkerProps = {
  lat: number;
  lng: number;
};

const Marker: React.FC<MarkerProps> = () => <PlaceIcon color="primary" style={{ fontSize: 30 }} />;

type GoogleMapDisplayProps = {
  lat: number;
  lng: number;
};

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ lat, lng }) => {
  const classes = useMapStyles()
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);

  const staticMapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=11&size=600x300&markers=color:blue%7C${lat},${lng}&key=${GOOGLE_MAPS_KEY}`;

  const defaultProps = {
    center: {
      lat: lat,
      lng: lng
    },
    zoom: 11
  };

  if (showInteractiveMap) {
    return (
      <Box height={200} width="100%">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <Marker
            lat={lat}
            lng={lng}
          />
        </GoogleMapReact>
      </Box>
    );
  }

  return (
    <Box
      height="100%"
      width="100%"
      sx={classes.staticMapContainer}
      onClick={() => setShowInteractiveMap(true)}
    >
      <Image
        src={staticMapURL}
        alt="Location Map"
        loading="lazy"
        width={550}
        height={275}
      />
    </Box>
  );
}

export default React.memo(GoogleMapDisplay);
