import React from 'react';
import { Drawer, Typography, Box, IconButton } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import AddContactForm from './AddContactForm';
import { useLayoutStyles } from '@/theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loadingData: boolean;
}

const AddContactModal: React.FC<ContactModalProps> = ({ open, onClose, onSubmit, loadingData }) => {
  const layoutClasses = useLayoutStyles()
  const handleFormSubmit = async (data: any) => {
    const enhancedData = {
      ...data,
      createdOn: Timestamp.now().toDate()
    };
    await onSubmit(enhancedData);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      // PaperProps={{
      //   className: layoutClasses.radiusBottomDrawer
      // }}
      sx={layoutClasses.radiusBottomDrawer}
    >
      <Box p={2}>
        <Typography variant="h4" align="center">Add contact</Typography>
        <AddContactForm
          isSave
          loadingData={loadingData}
          onSubmit={handleFormSubmit}
        />
      </Box>
      <IconButton
        aria-label="delete"
        color="primary"
        sx={layoutClasses.drawerCloseButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Drawer>
  );
};

export default AddContactModal;
