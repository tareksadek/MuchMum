// import { makeStyles } from '@mui/styles';
// import { Theme } from '@mui/material/styles';

// export const stepsStyles = makeStyles((theme: Theme) => ({
//   stickyBox: {
//     gap: theme.spacing(2),
//     paddingBottom: theme.spacing(2),
//     backgroundColor: theme.palette.background.default,
//     zIndex: 2,
//     '& button': {
//       flex: 1,
//     },
//     paddingTop: theme.spacing(2),
//     [theme.breakpoints.down('sm')]: {
//       position: 'fixed',
//       bottom: 0,
//       width: '100%',
//       left: 0,
//       padding: theme.spacing(2),
//     },
//   },
// }));

import { useTheme } from '@mui/material/styles';

export const useStepsStyles = () => {
  const theme = useTheme();

  const stickyBox = {
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
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
    // Other styles...
  };

  return { stickyBox };
};

