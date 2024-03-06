import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { RootState } from '@/store/reducers';
import { hideNotification } from '@/store/reducers/notificationCenter';

const Notification: React.FC = () => {
  const notification = useSelector((state: RootState) => state.notificationCenter.notification);
  const isOpen = useSelector((state: RootState) => state.notificationCenter.isOpen);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideNotification());
  };

  if (!notification) return null;

  const horizontal = notification.horizontal || 'right';
  const vertical = notification.vertical || 'top';

  return (
    <>
      {isOpen && notification && (
        <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ horizontal, vertical }}>
          <Alert onClose={handleClose} severity={notification.type}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Notification;