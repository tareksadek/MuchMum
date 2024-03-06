import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { Timestamp } from '@firebase/firestore';
import { RootState } from '@/store/reducers';
import AddContactForm from '@/components/Contacts/AddContactForm';
import { useLayoutStyles } from '../../../theme/layout';
import { useConnectModalStyles } from './styles';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loadingData: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose, onSubmit, loadingData }) => {
  const classes = useConnectModalStyles()
  const layoutClasses = useLayoutStyles()
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const restaurant = useSelector((state: RootState) => state.restaurant.restaurant);

  const appSetupCustomForm = appSetup && appSetup.contactFormData && appSetup.contactFormData.formProvider !== 'default' && appSetup.contactFormData.embedCode !== '' ? appSetup.contactFormData : null
  const profileCustomForm = restaurant && restaurant.contactFormData && restaurant.contactFormData.formProvider !== 'default' && restaurant.contactFormData.embedCode !== '' ? restaurant.contactFormData : null
  const customForm = appSetupCustomForm || profileCustomForm
  const isCustomForm = customForm && customForm.formProvider && customForm.embedCode

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
      sx={layoutClasses.radiusBottomDrawer}
    >
      <Box
        p={2}
        sx={{
          ...(isCustomForm && classes.iframeContainer)
        }}
      >
        {!isCustomForm && (
          <>
            <Typography variant="h4" align="center">Connect</Typography>
            <Box mt={1} mb={1}>
              <Typography variant="body1" align="center">Fill in the form to exchange your contact information with me.</Typography>
            </Box>
          </>
        )}

        <AddContactForm
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

export default ContactModal;
