import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { RootState } from '../../../store/reducers';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GoogleMapDisplay from '../GoogleMapDisplay';
import { useProfileInfoStyles } from './styles';
// import { useConnectivity } from '../../../contexts/ConnectivityContext';
import { RestaurantDataType } from '@/types/restaurant';

type InfoProps = {
  restaurant: RestaurantDataType;
}

const Info: React.FC<InfoProps> = ({ restaurant }) => {
  // const connectivity = useConnectivity();
  const classes = useProfileInfoStyles()
  const setup = useSelector((state: RootState) => state.setup.setup);
  
  const themeColorName = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.name : ''
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''
  const iconColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;

  let address, location;

  if (setup && setup.basicInfoData && setup.basicInfoData.address) {
    address = setup.basicInfoData.address;
  } else if (restaurant && restaurant.basicInfoData && restaurant.basicInfoData.address) {
    address = restaurant.basicInfoData.address;
  }

  if (setup && setup.basicInfoData && setup.basicInfoData.location) {
    location = setup.basicInfoData.location;
  } else if (restaurant && restaurant.basicInfoData && restaurant.basicInfoData.location) {
    location = restaurant.basicInfoData.location;
  }

  return (
    <Box
      sx={classes.infoContainer}
      width="100%"
    >
      <List>
        {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.email && (
          <ListItem>
            <ListItemIcon>
              <MailIcon
                {...(iconColor ? { style: { color: iconColor } } : {})}
              />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <a
                  href={`mailto:${restaurant.basicInfoData.email}`}
                  aria-label={`Send email to ${restaurant.basicInfoData?.firstName || ''} ${restaurant.basicInfoData?.lastName || ''}`}
                >
                  {restaurant.basicInfoData.email}
                </a>
              )}
            />
          </ListItem>
        )}
        {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.phone1 && (
          <ListItem>
            <ListItemIcon>
              <PhoneIphoneIcon
                {...(iconColor ? { style: { color: iconColor } } : {})}
              />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <a
                  href={`tel:${restaurant.basicInfoData.phone1}`}
                  aria-label={`Call ${restaurant.basicInfoData?.firstName || ''} ${restaurant.basicInfoData?.lastName || ''}`}
                >
                  {restaurant.basicInfoData.phone1}
                </a>
              )}
            />
          </ListItem>
        )}
        {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.phone2 && (
          <ListItem>
            <ListItemIcon>
              <PhoneIphoneIcon
                {...(iconColor ? { style: { color: iconColor } } : {})}
              />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <a
                  href={`tel:${restaurant.basicInfoData.phone2}`}
                  aria-label={`Call ${restaurant.basicInfoData?.firstName || ''} ${restaurant.basicInfoData?.lastName || ''}`}
                >
                  {restaurant.basicInfoData.phone2}
                </a>
              )}
            />
          </ListItem>
        )}
        {address && location && (
          <>
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon
                  {...(iconColor ? { style: { color: iconColor } } : {})}
                />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={(
                  <a
                    href={`geo:${location && location.lat ? location.lat : 0},${location && location.lng ? location.lng : 0}?q=${address}`}
                    aria-label={`Open ${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} address on google maps`}
                  >
                    {address}
                  </a>
                )}
              />
            </ListItem>
            {/* {location && location.lat && location.lng && connectivity.isOnline && ( */}
            {location && location.lat && location.lng && (
              <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
                <GoogleMapDisplay lat={location.lat} lng={location.lng} />
              </ListItem>
            )}
          </>
        )}
        {address && !location && (
          <>
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon
                  {...(iconColor ? { style: { color: iconColor } } : {})}
                />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={(
                  <Typography variant="body1">
                    {address}
                  </Typography>
                )}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
};

export default Info;
