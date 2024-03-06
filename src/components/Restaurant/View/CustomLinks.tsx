import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/reducers';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { incrementLinkClickCount, incrementTeamLinkClickCount } from '@/API/restaurant';
import { LinkType } from '@/types/restaurant';
import { RestaurantDataType } from '@/types/restaurant';
import { fetchRestaurantLinks } from '@/store/reducers/restaurant';
import { restaurantSelector } from '@/store/selectors/restaurant';

type CustomLinksProps = {
  restaurant: RestaurantDataType;
  restaurantLinks?: {
    social: LinkType[],
    custom: LinkType[]
  };
}

const CustomLinks: React.FC<CustomLinksProps> = ({ restaurant, restaurantLinks }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const setup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)
  const themeColorName = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.name : ''
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''
  const borderColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;
  const isTeamMember = user?.isTeamMember
  const teamId = user?.batchId
  

  let links;

  if (setup && setup.links) {
    links = setup.links;
  } else if (restaurantLinks) {
    links = restaurantLinks;
  }

  const sortedLinks = links && links.custom
    ? [...links.custom]
        .filter(link => link.active)
        .sort((a, b) => a.position - b.position)
    : [];

  const handleLinkClick = async (link: LinkType) => {
    if((!isLoggedIn || !isAccountOwner) && user && user.id && restaurant && restaurant.id && link && link.id) {
        await incrementLinkClickCount(user.id, restaurant.id, link.id);
    }
  }

  return (
    <>
      {links && links.custom && links.custom.length > 0 && (
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            flexDirection="column"
            gap={2}
            pl={1}
            pr={1}
          >
            {sortedLinks.map((link, index) => (
              <Box
                key={link.id || index}
                width="100%"
              >
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  width="100%"
                >
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    variant='outlined'
                    fullWidth
                    style={{
                      justifyContent: 'space-between',
                      ...(borderColor ? { borderColor: borderColor } : {}),
                      ...(borderColor ? { color: borderColor } : {})
                    }}
                    aria-label={`Visit ${link.title}`}
                  >
                    {link.title}
                  </Button>
                </Link>
              </Box>
            ))}

              <Button
                endIcon={<ArrowForwardIosIcon />}
                variant='outlined'
                onClick={() => router.push('/info')}
                fullWidth
                style={{
                  justifyContent: 'space-between',
                  ...(borderColor ? { borderColor: borderColor } : {}),
                  ...(borderColor ? { color: borderColor } : {})
                }}
              >
                info
              </Button>
          </Box>
      )}
    </>
  );
};

export default CustomLinks;
