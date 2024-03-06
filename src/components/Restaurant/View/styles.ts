import { useTheme } from '@mui/material/styles';

export const useDefaultHeaderStyles = () => {
  const theme = useTheme();

  const imagesContainer = {
    position: 'relative',
  };

  const coverImageContainer = {
    borderBottomLeftRadius: theme.spacing(4),
    borderBottomRightRadius: theme.spacing(4),
    margin: '0 auto',
    ['@media (max-width:480px)']: {
      minHeight: '180px'
    },
    ['@media (max-width:390px)']: {
      minHeight: '150px'
    },
    '& img': {
      display: 'block',
      width: '100%',
      borderBottomLeftRadius: theme.spacing(4),
      borderBottomRightRadius: theme.spacing(4),
    },
  };
  const profileImageContainer = {
    position: 'absolute',
    bottom: '-50px',
    left: 0,
    right: 0,
    top: 'auto',
    margin: 'auto',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
    borderRadius: '50%',
  };
  const dataContainer = {};

  const headerContainer = {};

  return { headerContainer, imagesContainer, coverImageContainer, profileImageContainer, dataContainer };
};

export const useBusinessHeaderStyles = () => {
  const theme = useTheme();

  const imagesContainer = {
    position: 'relative',
  };
  const coverImageContainer = {
    margin: '0 auto',
    clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
    '& img': {
      display: 'block',
      width: '100%',
      borderBottomLeftRadius: theme.spacing(4),
      borderBottomRightRadius: theme.spacing(4),
    },
  };
  const profileImageContainer = {
    position: 'absolute',
    bottom: '45px',
    left: 'auto',
    right: theme.spacing(2),
    top: 'auto',
    margin: 'auto',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
    borderRadius: '50%',
  };
  const dataContainer = {
    '& h3': {
      color: "#fff"
    },
    '& p': {
      color: "#fff"
    }
  };
  const socialLinksContainer = {};

  const headerContainer = {};

  return { headerContainer, imagesContainer, coverImageContainer, profileImageContainer, dataContainer, socialLinksContainer };
};

export const useCardHeaderStyles = () => {
  const theme = useTheme();

  const imagesContainer = {
    position: 'relative',
  };
  const coverImageContainer = {
    margin: '0 auto',
    position: 'relative',
    paddingTop: '120px',
    '&:after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: '85px',
      background: theme.palette.background.default,
      width: '100%',
      zIndex: 1,
    },
    '& img': {
      display: 'block',
      width: '100%',
    },
  };
  const profileImageContainer = {
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
    borderRadius: '50%',
  };
  const dataContainer = {};
  const cardContainer = {
    backgroundColor: theme.palette.background.default,
    boxShadow: '0px 0px 10px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: '80%',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  };

  const headerContainer = {};

  return { headerContainer, imagesContainer, coverImageContainer, cardContainer, profileImageContainer, dataContainer };
};

export const useSocialHeaderStyles = () => {
  const theme = useTheme();

  const imagesContainer = {
    position: 'relative',
  };
  const coverImageContainer = {
    margin: '0 auto',
    position: 'relative',
    '& img': {
      display: 'block',
      width: '100%',
    },
  };
  const profileImageContainer = {
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
    borderRadius: '50%',
  };
  const dataContainer = {
    position: 'relative',
    top: theme.spacing(2),
  };
  const cardContainer = {
    backgroundColor: theme.palette.background.default,
    borderTopRightRadius: theme.spacing(4),
    borderTopLeftRadius: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: '100%',
    margin: '0 auto',
    position: 'relative',
    top: '-40px',
    boxShadow: '0 -7px 7px rgba(0, 0, 0, 15%)',
  };

  const headerContainer = {};

  return { headerContainer, imagesContainer, coverImageContainer, profileImageContainer, dataContainer, cardContainer };
};

export const useActionButtonsStyles = () => {
  const theme = useTheme();

  const actionButton = {
    borderRadius: theme.spacing(8),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    flex: 1,
    color: '#ffffff !important',
    ['@media (max-width:480px)']: {
      fontSize: '0.8rem',
    },
    ['@media (max-width:415px)']: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    ['@media (max-width:350px)']: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  };

  const actionButtonsContainer = {};

  return { actionButton, actionButtonsContainer };
};

export const useProfileInfoStyles = () => {
  const theme = useTheme();

  const infoContainer = {
    '& .MuiList-root': {
      padding: 0,
      '& .MuiListItem-root': {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        '& .MuiListItemIcon-root': {
          minWidth: '40px',
          '& svg': {
            color: theme.palette.background.blue
          }
        },
        '& .MuiListItemText-root': {
          '& a': {
            color: theme.palette.background.reverse,
          },
        },
      },
    },
  };

  return { infoContainer };
};

export const useConnectModalStyles = () => {
  const iframeContainer = {
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
    }
  };

  return { iframeContainer };
};