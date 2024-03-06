import { useTheme } from '@mui/material/styles';

export const useRestaurantURLStyles = () => {
  const theme = useTheme();

  const container = {
    backgroundColor: theme.palette.background.blue,
    borderRadius: theme.spacing(1)
  };

  const url = {
    color: '#fff',
  }

  return { container, url };
};