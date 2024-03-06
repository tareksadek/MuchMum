import styled from '@emotion/styled';
import Cropper from 'react-easy-crop';
import { SketchPicker } from 'react-color';
import { useTheme } from '@mui/material/styles';

export const useImageCropperStyles = () => {
  const theme = useTheme();

  const delButtonContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.red,
    color: '#fff',
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    width: 24,
    height: 24,
    '::hover': {
      backgroundColor: theme.palette.background.red,
      color: '#fff',
    },
  };

  const currentImageContainer = {
    position: 'relative',
  };

  return { delButtonContainer, currentImageContainer };
};

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

  return { 
    buttonsContainer, 
    buttonContainer, 
    buttonContainerDisabled, 
    platformTitle, 
    linkItemIconButton, 
    linksListItem, 
    linkItemDragIcon, 
    placeholderIconContainer,
    inactiveChip,
  };
};

export const useThemeStyles = () => {
  const theme = useTheme();

  const layoutContainer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 350,
  };

  const layoutItem = {
    position: 'relative',
    '& p': {
      color: theme.palette.background.defaultText,
    },
  };

  const layoutIcon = {
    '& svg': {
      fontSize: '140px !important',
    },
  };

  const selectedLayoutIconContainer = {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: '50%',
  };

  const selectedLayoutIcon = {
    color: theme.palette.background.selectedItemIcon,
  };

  const themeSelectedIconContainer = {
    backgroundColor: theme.palette.background.selectedItemIcon,
  };

  const themeIconContainer = {
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: theme.palette.background.defaultIcon,
    '& svg': {
      fontSize: 32,
    },
    [`&.${themeSelectedIconContainer}`]: {
      backgroundColor: theme.palette.background.selectedItemIcon,
    },
    '&:hover': {
      cursor: 'pointer',
    },
  };

  const colorItem = {
    width: 45,
    height: 45,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
  };

  return { 
    layoutContainer, layoutItem, layoutIcon, 
    selectedLayoutIconContainer, selectedLayoutIcon, 
    themeIconContainer, themeSelectedIconContainer, colorItem 
  };
};

export const useMapStyles = () => {
  const staticMapContainer = {
    position: 'relative',
    '& img': {
      maxWidth: 550,
      width: '100%',
      height: 'auto',
    },
  };

  return { staticMapContainer };
};

type IconCircleProps = {
  bgColor?: string;
};

export const StyledCropper = styled(Cropper)`
    .reactEasyCrop_Container {
        width: 100%;
        max-width: 550px;
        max-height: 550px;
        margin: auto;
    }
`;

export const StyledSketchPicker = styled(SketchPicker)`
  > div: first-of-type {
    height: 200px;
    padding-bottom: 0 !important;
  }
  > div: last-child {
    display: none !important;
  }
`;

export const IconCircle = styled.div<IconCircleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.bgColor};
  svg {
    color: #fff;
  }
`;
