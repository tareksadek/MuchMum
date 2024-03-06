import { useTheme } from '@mui/material/styles';

export const useAppStyles = () => {
  const theme = useTheme();

  const contentContainer = {
    maxWidth: '550px !important',
    padding: '0 !important',
  };

  const mainBox = {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(10),
    },
  };

  return { mainBox, contentContainer };
};

export const useAppHeaderStyles = () => {
  const theme = useTheme();

  const appBarButtons = {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.background.headerButtons,
    '& svg': {
      fontSize: '1.5rem',
    },
  };
  const profileAppBar = {
    backgroundColor: 'transparent !important',
    maxWidth: 550,
    margin: 'auto',
    left: 0,
    right: 0,
  };
  const offlineChip = {
    backgroundColor: theme.palette.background.reverse,
    color: theme.palette.background.default,
    position: 'absolute',
    left: 0,
    right: 0,
    width: 130,
    margin: 'auto',
    bottom: 'auto',
    top: theme.spacing(2),
    opacity: 0.75,
    '& .MuiSvgIcon-root': {
      color: theme.palette.background.default,
    },
  };

  const appBarRoot = {
    backgroundColor: `${theme.palette.background.default} !important`,
    backgroundImage: 'none !important',
    boxShadow: '0 0 0 transparent !important',
    maxWidth: 550,
    margin: '0 auto',
    '& .MuiToolbar-root': {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      minHeight: theme.spacing(7),
    },
    '& .appBarButtons': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.headerButtons,
      '& svg': {
        fontSize: '1.5rem',
      },
    },
    '& .profileAppBar': {
      backgroundColor: 'transparent !important',
      maxWidth: 550,
      margin: 'auto',
      left: 0,
      right: 0,
    },
    '& .offlineChip': {
      backgroundColor: theme.palette.background.reverse,
      color: theme.palette.background.default,
      position: 'absolute',
      left: 0,
      right: 0,
      width: 130,
      margin: 'auto',
      bottom: 'auto',
      top: theme.spacing(2),
      opacity: 0.75,
      '& .MuiSvgIcon-root': {
        color: theme.palette.background.default,
      },
    },
  };

  return { appBarRoot, appBarButtons, profileAppBar, offlineChip };
};

export const useSaveButtonStyles = () => {
  const theme = useTheme();

  const saveButtonSuccess = {
    backgroundColor: `${theme.palette.background.green} !important`,
    '& svg': {
      color: '#fff !important',
    },
  };
  const saveButtonError = {
    backgroundColor: `${theme.palette.background.danger} !important`,
    '& svg': {
      color: '#fff !important',
    },
  };

  const saveButton = {
    '&.saveButtonSuccess': {
      backgroundColor: `${theme.palette.background.green} !important`,
      '& svg': {
        color: '#fff !important',
      },
    },
    '&.saveButtonError': {
      backgroundColor: `${theme.palette.background.danger} !important`,
      '& svg': {
        color: '#fff !important',
      },
    },
  };

  return { saveButton, saveButtonSuccess, saveButtonError };
};

export const useSideMenuStyles = () => {
  const theme = useTheme();

  const sideMenuPaper = {
    '& > .MuiPaper-root': {
      width: 230,
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      '& .MuiList-root': {
        padding: 0,
      }
    }
  };

  const switchButton = {
    borderRadius: 100,
    marginBottom: theme.spacing(1),
    width: '100%',
    textTransform: 'initial',
    padding: theme.spacing(1),
  };

  const switchButtonsContainer = {};

  const switchDialogButton = {
    '& .MuiListItemText-root': {
      textTransform: 'capitalize',
    },
  };

  const accordionRoot = {
    boxShadow: '0 0 0 transparent',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    '::before': {
      backgroundColor: 'transparent',
    },
    '& .MuiCollapse-root .MuiAccordionDetails-root': {
      padding: 0,
      '& .MuiList-root .MuiButtonBase-root': {
        paddingLeft: 0,
        paddingRight: 0,
        '& .MuiListItemIcon-root': {
          color: theme.palette.background.accordionButtonIcon,
          minWidth: 30,
        },
        '& .MuiListItemText-root': {
          textTransform: 'capitalize',
        },
        '&.Mui-selected': {
          backgroundColor: 'transparent',
          '& .MuiListItemIcon-root': {
            color: theme.palette.background.accordionButtonIconSelected,
          },
        },
        '::hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    '& .MuiAccordionSummary-root': {
      backgroundColor: 'transparent',
      border: 'none',
    },
    '& .MuiAccordionDetails-root': {
      backgroundColor: 'transparent',
    },
  };

  const accordionSummaryRoot = {
    padding: 0,
    '& .MuiAccordionSummary-content': {
      marginTop: 0,
      marginBottom: 0,
      '& .MuiListItemText-root .MuiTypography-root': {
        textTransform: 'capitalize',
        fontWeight: 600,
      },
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.background.accordionIcon,
    },
    '& .Mui-expanded': {
      minHeight: 30,
    },
  };

  const menuLinksList = {
    '& .MuiButtonBase-root': {
      paddingLeft: 0,
      paddingRight: 0,
      '& .MuiListItemIcon-root': {
        color: theme.palette.background.accordionButtonIcon,
        minWidth: 30,
      },
      '& .MuiListItemText-root': {
        textTransform: 'capitalize',
      },
      '&.Mui-selected': {
        backgroundColor: 'transparent',
        '& .MuiListItemIcon-root': {
          color: theme.palette.background.accordionButtonIconSelected,
        },
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  };

  return {
    sideMenuPaper,
    switchButton,
    switchButtonsContainer,
    switchDialogButton,
    accordionRoot,
    accordionSummaryRoot,
    menuLinksList
  };
};



