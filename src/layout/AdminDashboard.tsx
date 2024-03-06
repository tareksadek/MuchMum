import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/reducers';
import { Button, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useSideMenuStyles } from './appStyles';
import { closeModal } from '@/store/reducers/modal';

const AdminDashboard: React.FC = () => {
  const classes = useSideMenuStyles();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const goToDashboard = () => {
    dispatch(closeModal())
    router.push('/AdminDashboard')
  }

  return (
    <Box>
      <Typography variant="body1" align="center" onClick={goToDashboard}>App Admin</Typography>
      <Box mt={2} sx={classes.switchButtonsContainer}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={goToDashboard}
          startIcon={<DashboardIcon />}
          sx={classes.switchButton}
        >
          Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(AdminDashboard);

