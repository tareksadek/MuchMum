import { useTheme } from '@mui/material/styles';

export const useLinksStyles = () => {
  const theme = useTheme();

  const buttonsContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    flexWrap: 'wrap',
  };

  const buttonContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: `${theme.spacing(1)} !important`,
    maxWidth: 50,
    '& .MuiListItemIcon-root': {
      minWidth: 50,
    },
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
      textTransform: 'capitalize',
    },
  };

  const buttonContainerDisabled = {
    opacity: 0.5,
  };

  const platformTitle = {
    fontSize: '0.75rem',
  };

  const linkItemIconButton = {
    color: theme.palette.background.listItemIconButton
  };

  const linksListItem = {
    backgroundColor: theme.palette.background.listItem,
    border: `1px solid ${theme.palette.background.listItemBorder}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0
    },
  };

  const linkItemDragIcon = {
    color: theme.palette.background.listItemDragHandler,
    marginRight: theme.spacing(1),
  };

  const placeholderIconContainer = {
    backgroundColor: '#BEC9D8',
    borderRadius: '50%',
    width: 120,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      fontSize: 65,
    },
  };

  const inactiveChip = {
    backgroundColor: '#fff4e5',
    color: '#663c00'
  }

  const activeChip = {
    backgroundColor: '#edf7ed',
    color: '#1e4620'
  }

  return { 
    buttonsContainer, 
    buttonContainer, 
    buttonContainerDisabled, 
    platformTitle, 
    linkItemIconButton, 
    linksListItem, 
    linkItemDragIcon, 
    placeholderIconContainer,
    activeChip,
    inactiveChip,
  };
};

