import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

const size = 50;

// export const cubeStyles = makeStyles((theme: Theme) => ({
//   '@keyframes folding': {
//     '0%, 10%': {
//       transform: 'perspective(140px) rotateX(-180deg)',
//       opacity: 0,
//     },
//     '25%, 75%': {
//       transform: 'perspective(140px) rotateX(0deg)',
//       opacity: 1,
//     },
//     '90%, 100%': {
//       transform: 'perspective(140px) rotateY(180deg)',
//       opacity: 0,
//     }
//   },
//   '@keyframes text': {
//     '100%': {
//       top: size / 2 + 10,
//     }
//   },
//   '@keyframes shadow': {
//     '100%': {
//       bottom: -18,
//       width: size * 2,
//     }
//   },
//   backdropContainer: {
//     position: 'absolute',
//     backgroundColor: theme.palette.background.backdrop,
//     width: '100%',
//     height: '100%',
//     left: 0,
//     top: 0,
//     zIndex: 9999,
//   },
//   loading: {},
//   cubeWrapper: {
//     position: 'fixed',
//     left: '50%',
//     top: '50%',
//     marginTop: -size,
//     marginLeft: -size * 3,
//     width: size * 6,
//     height: size * 2,
//     textAlign: 'center',
//     '&::after': {
//       content: '""',
//       position: 'absolute',
//       left: 0,
//       right: 0,
//       bottom: -20,
//       margin: 'auto',
//       width: size * 1.8,
//       height: 6,
//       zIndex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.1)',
//       filter: 'blur(2px)',
//       borderRadius: '100%',
//       animation: '$shadow 0.5s ease infinite alternate',
//     },
//     '& $loading': {
//       letterSpacing: '0.1em',
//       display: 'block',
//       position: 'relative',
//       top: size / 2,
//       zIndex: 2,
//       animation: '$text 0.5s ease infinite alternate',
//     }
//   },
//   leaf2: {},
//   leaf3: {},
//   leaf4: {},
//   cubeFolding: {
//     width: size,
//     height: size,
//     display: 'inline-block',
//     fontSize: 0,
//     '& span': {
//       position: 'relative',
//       width: size / 2,
//       height: size / 2,
//       transform: 'scale(1.1)',
//       display: 'inline-block',
//       '&::before': {
//         content: '""',
//         backgroundColor: theme.palette.grey[200],
//         position: 'absolute',
//         left: 0,
//         top: 0,
//         display: 'block',
//         width: size / 2,
//         height: size / 2,
//         transformOrigin: '100% 100%',
//         animation: '$folding 2.5s infinite linear both',
//       },
//     },
//     '& $leaf2': {
//       transform: 'rotateZ(90deg) scale(1.1)',
//       '&::before': {
//         animationDelay: '0.3s',
//         backgroundColor: theme.palette.grey[300],
//       }
//     },
//     '& $leaf3': {
//       transform: 'rotateZ(270deg) scale(1.1)',
//       '&::before': {
//         animationDelay: '0.9s',
//         backgroundColor: theme.palette.grey[400],
//       }
//     },
//     '& $leaf4': {
//       transform: 'rotateZ(180deg) scale(1.1)',
//       '&::before': {
//         animationDelay: '0.6s',
//         backgroundColor: theme.palette.grey[500],
//       }
//     },
//   },
// }));

export const useCubeStyles = () => {
  const theme = useTheme();

  const loading = {
    letterSpacing: '0.1em',
    display: 'block',
    position: 'relative',
    top: 40 / 2,
    zIndex: 2,
    animation: 'text 0.5s ease infinite alternate',
  };

  const leaf1 = {
    position: 'relative',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    transform: 'scale(1.1)',
    '::before': {
      content: '""',
      backgroundColor: theme.palette.grey[200],
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'block',
      width: '20px',
      height: '20px',
      transformOrigin: '100% 100%',
      animation: 'folding 2.5s infinite linear both',
    },
  }

  const leaf2 = {
    position: 'relative',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    transform: 'rotateZ(90deg) scale(1.1)',
    '::before': {
      content: '""',
      backgroundColor: theme.palette.grey[300],
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'block',
      width: '20px',
      height: '20px',
      transformOrigin: '100% 100%',
      animation: 'folding 2.5s infinite linear both 0.3s',
    },
  };

  const leaf3 = {
    position: 'relative',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    transform: 'rotateZ(270deg) scale(1.1)',
    '::before': {
      content: '""',
      backgroundColor: theme.palette.grey[400],
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'block',
      width: '20px',
      height: '20px',
      transformOrigin: '100% 100%',
      animation: 'folding 2.5s infinite linear both 0.9s',
    },
  };

  const leaf4 = {
    position: 'relative',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    transform: 'rotateZ(180deg) scale(1.1)',
    '::before': {
      content: '""',
      backgroundColor: theme.palette.grey[500],
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'block',
      width: '20px',
      height: '20px',
      transformOrigin: '100% 100%',
      animation: 'folding 2.5s infinite linear both 0.6s',
    },
  };

  const backdropContainer = {
    position: 'absolute',
    backgroundColor: theme.palette.background.backdrop,
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    zIndex: 9999,
  };

  const cubeWrapper = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    marginTop: '-40px',
    marginLeft: '-120px',
    width: '240px',
    height: '80px',
    textAlign: 'center',
    '::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-20px',
      margin: 'auto',
      width: '72px',
      height: '6px',
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      filter: 'blur(2px)',
      borderRadius: '100%',
      animation: 'shadow 0.5s ease infinite alternate',
    },
  };

  const cubeFolding = {
    width: '40px',
    height: '40px',
    display: 'inline-block',
    fontSize: 0,
  };

  return { backdropContainer, cubeWrapper, cubeFolding, loading, leaf1, leaf2, leaf3, leaf4 };
};


type BackdropProps = {
  boxed?: boolean;
}

const BackdropStyled = styled('div')<BackdropProps>(({ theme, boxed }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: '#fff',
  flexDirection: 'column',
  backgroundColor: '#000000',
  position: 'fixed',
  top: 0,
  bottom: 'auto',
  ...(boxed && {
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }),
}));

const LoadingBoxStyled = styled('div')<BackdropProps>(({ theme }) => ({
  // position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
  width: 300,
  height: 85,
  padding: theme.spacing(2),
  backgroundColor: '#f2f2f2',
  borderRadius: theme.spacing(1),
  boxShadow: '0 0 5px #222',
}));

const ProgressContainerStyled = styled('div')<BackdropProps>(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
  width: 300,
  height: 85,
  padding: theme.spacing(2),
  backgroundColor: '#f2f2f2',
  borderRadius: theme.spacing(1),
  boxShadow: '0 0 5px #222',
  '& .MuiLinearProgress-root': {
    height: 5,
    borderRadius: theme.spacing(2),
    backgroundColor: '#272727',
  },
  '& .MuiLinearProgress-barColorPrimary': {
    backgroundColor: '#00c1af',
  },
  '& .MuiLinearProgress-bar1Buffer': {
    backgroundColor: '#272727',
  },
}));

const ProgressMessageStyled = styled('div')<BackdropProps>(({ theme }) => ({
  padding: 0,
  textAlign: 'center',
  color: '#272727',
  fontSize: '0.8rem',
  position: 'relative',
  zIndex: 1,
}));

const ProgressPercentageContainerStyled = styled('div')<BackdropProps>(({ theme }) => ({
  position: 'initial',
  padding: 0,
  textAlign: 'center',
  color: '#272727',
  fontSize: '0.8rem',
}));

export {
  BackdropStyled,
  LoadingBoxStyled,
  ProgressContainerStyled,
  ProgressMessageStyled,
  ProgressPercentageContainerStyled
};
