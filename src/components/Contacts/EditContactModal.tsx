import React from 'react';
import { Drawer, Typography, Box, IconButton } from '@mui/material';
import { Timestamp } from '@firebase/firestore';
import AddContactForm from './AddContactForm';
import { ContactType } from '@/types/contact';
import { useLayoutStyles } from '@/theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface ContactModalProps {
  contact?: ContactType | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<void>;
  loadingData: boolean;
}

const EditContactModal: React.FC<ContactModalProps> = ({
  contact,
  open,
  onClose,
  onSubmit,
  loadingData,
}) => {
  const layoutClasses = useLayoutStyles()
  const handleFormSubmit = async (data: any) => {
    if (contact && contact.id) {
      const enhancedData = {
        ...data,
        createdOn: Timestamp.now().toDate()
      };
      await onSubmit(contact.id, enhancedData);
      onClose();
    }
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
        <Typography variant="h4" align="center">Edit contact</Typography>
        <AddContactForm
          isEdit
          contact={contact}
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

export default EditContactModal;
