import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from "@mui/material";
import { MenuIcon, QrIcon, Logo } from './CustomIcons';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useAppHeaderStyles } from './appStyles';
import { AppDispatch } from '@/store/reducers';
import { openModal } from '@/store/reducers/modal';

type AppHeaderProps = {
  isLoggedIn: boolean;
  onMenuButtonClick: () => void;
};

type HideOnScrollProps = {
  children: React.ReactElement;
};

const HideOnScroll: React.FC<HideOnScrollProps> = (props) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

const RestaurantHeader: React.FC<AppHeaderProps> = ({
  isLoggedIn,
  onMenuButtonClick,
}) => {
  const classes = useAppHeaderStyles()
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const goToLogin = () => {
    if (!isLoggedIn) {
      router.push('/Login')
    }
  }

  const handleQrClick = () => {
    dispatch(openModal('qr'));
  };

  const handleOfflineChipClick = () => {
    alert("You're offline right now. No worries! You can still use the app, but be aware that some data might not be up-to-date and a few features require an online connection. We'll sync everything once you're back online!")
  }  

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          classes={{
            root: `${classes.appBarRoot} ${classes.profileAppBar}`
          }}
          sx={{
            ...classes.appBarRoot,
            ...(true && classes.profileAppBar),
          }}
        >
          <Toolbar>
            <IconButton
              edge="end"
              aria-label="qr-code"
              onClick={goToLogin}
              sx={classes.appBarButtons}
            >
              <Logo />
            </IconButton>

            <IconButton
              edge="end"
              aria-label="qr-code"
              style={{
                marginLeft: 'auto',
                marginRight: 0,
                visibility: 'visible',
              }}
              onClick={handleQrClick}
              sx={classes.appBarButtons}
            >
              <QrIcon />
            </IconButton>

            {isLoggedIn && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={onMenuButtonClick}
                sx={classes.appBarButtons}
                style={{
                  marginLeft: 16,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </>
  );
}

export default RestaurantHeader;