import { useTheme } from '@mui/material/styles';

export const useLayoutStyles = () => {
  const theme = useTheme();

  const drawerCloseButton = {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(2),
  };

  const drawerCloseButtonRight = {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(2),
  }

  const radiusBottomDrawer = {
    position: 'relative',
    '& > .MuiPaper-root': {
      borderTopLeftRadius: theme.spacing(4),
      borderTopRightRadius: theme.spacing(4),
    }
  };

  const stickyBottomBox = {
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
    opacity: 0,
    animation: 'fadeIn 0.5s forwards',
    '& button': {
      flex: 1,
    },
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      left: 0,
      padding: theme.spacing(2),
    },
  };

  const panel = {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.panel,
  };

  return { drawerCloseButton, drawerCloseButtonRight, radiusBottomDrawer, stickyBottomBox, panel };
};

