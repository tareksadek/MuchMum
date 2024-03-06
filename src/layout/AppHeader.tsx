import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Slide,
  Chip
} from "@mui/material";
import { MenuIcon, QrIcon, Logo } from './CustomIcons';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useSubmit, SubmitContext } from '../contexts/SubmitContext';
import HomeIcon from '@mui/icons-material/Home';
import { useAppHeaderStyles } from './appStyles';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { authSelector } from '@/store/selectors/auth';
import { AppDispatch } from '@/store/reducers';
import { openModal } from '@/store/reducers/modal';

type AppHeaderProps = {
  userUrlSuffix: string | null;
  isAdminDashboardPage: boolean;
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

const AppHeader: React.FC<AppHeaderProps> = ({
  userUrlSuffix,
  isAdminDashboardPage,
  isLoggedIn,
  onMenuButtonClick,
}) => {
  const classes = useAppHeaderStyles()
  const submit = useSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { formChanged, formValid } = context;
  const connectivity = useConnectivity();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isAdmin } = useSelector(authSelector);

  const getTitleFromPathname = (pathname: string) => {
    const userRegex = /^\/users\/[^/]+$/; // Matches /users/:userId
    const userContactsRegex = /^\/users\/[^/]+\/contacts$/; // Matches /users/:userId/contacts
    const userAnalyticsRegex = /^\/users\/[^/]+\/analytics$/; // Matches /users/:userId/analytics
    const userImpactRegex = /^\/users\/[^/]+\/impact$/; // Matches /users/:userId/impact

    const batchInvitationsRegex = /^\/batches\/[^/]+\/invitations$/; // Matches /batches/:batchId/invitations

    const memberContactsRegex = /^\/member\/[^/]+\/contacts$/; // Matches /member/:memberId/contacts
    const memberAnalyticsRegex = /^\/member\/[^/]+\/analytics$/; // Matches /member/:memberId/analytics
    const memberImpactRegex = /^\/member\/[^/]+\/impact$/; // Matches /member/:memberId/impact

    const teamRegex = /^\/team\/[^/]+$/; // Matches /team/:teamuserId
    const teamAnalyticsRegex = /^\/team\/[^/]+\/analytics$/; // Matches /team/:teamId/analytics
    const teamImpactRegex = /^\/team\/[^/]+\/impact$/; // Matches /team/:teamId/impact

    switch (pathname) {
      case "/createProfile":
        return "Create Card";
      case "/info":
        return "Info";
      case "/masterInfo":
        return "Info";
      case "/about":
        return "About";
      case "/theme":
        return "Theme";
      case "/images":
        return "Images";
      case "/coverImage":
        return "Cover Image";
      case "/profileImage":
        return "Profile Image";
      case "/links":
        return "Links";
      case "/teamInfo":
        return "Team Info";
      case "/contacts":
        return "Contacts";
      case "/contactForm":
        return "Contact Form";
      case "/efficiency":
        return "Card Analytics";
      case "/impact":
        return "Environmental Impact";
      case "/share":
        return "Card Share";
      case "/qrcode":
        return "QR Code";
      case "/redirect":
        return "Card Redirect";
      case "/adminDashboard":
        return "Dashboard";
      case "/batches":
        return "Batches";
      case "/teams":
        return "Teams";
      case "/createBatch":
        return "Create New Batch";
      case "/users":
        return "Users";
      case "/myTeam":
        return "My Team";
      case "/myTeam/analytics":
        return "My Team: Analytics";
      case "/myTeam/impact":
        return "My Team: Impact";
      case "/users/:userId":
        return "User Details";
      default:
        return "";
    }
  };

  const currentTitle = getTitleFromPathname(router.pathname);

  const shouldShowSaveButton = (pathname: string) => {
    // const pagesWithSaveButton = ["/info", "/about", "/theme", "/images", "/links", "/contactForm", "/redirect"];
    const pagesWithSaveButton = ["/dummyPage"]
    return pagesWithSaveButton.includes(pathname);
  };

  const onBackClick = () => {    
      if (isAdmin) {
        router.push('/AdminDashboard');
      } else {
        router.push(`/${userUrlSuffix}`);
      }
  };

  const goToLogin = () => {
    if (isLoggedIn) {
      router.push(`/${userUrlSuffix}`)
    } else {
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
          position="sticky"
          classes={{
            root: `${classes.appBarRoot}`
          }}
          sx={classes.appBarRoot}
        >
          <Toolbar>
            {isAdminDashboardPage && (
              <IconButton
                edge="end"
                aria-label="qr-code"
                onClick={isLoggedIn ? onBackClick : goToLogin}
                sx={classes.appBarButtons}
              >
                <Logo />
              </IconButton>
            )}

            {!isAdminDashboardPage && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={onBackClick}
                sx={classes.appBarButtons}
              >
                <HomeIcon />
              </IconButton>
            )}

            {!isAdminDashboardPage && (
              <Typography variant="body1" style={{ flexGrow: 1, textTransform: 'capitalize', marginTop: 6 }} onClick={() => true}>
                {currentTitle}
              </Typography>
            )}

            {!connectivity.isOnline && (
              <Chip
                icon={<SignalWifiConnectedNoInternet4Icon />}
                size="small"
                label="Working Offline"
                sx={classes.offlineChip}
                onClick={handleOfflineChipClick}
              />
            )}

            {isAdminDashboardPage ? (
              <IconButton
                edge="end"
                aria-label="qr-code"
                style={{
                  marginLeft: 'auto',
                  marginRight: 0,
                  visibility: isAdminDashboardPage ? 'hidden' : 'visible',
                }}
                onClick={handleQrClick}
                sx={classes.appBarButtons}
              >
                <QrIcon />
              </IconButton>
            ) : shouldShowSaveButton(router.pathname) && (
              <Button
                color="inherit"
                onClick={submit}
                disabled={!formChanged || !formValid}
              >
                Save
              </Button>
            )}

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

export default AppHeader;