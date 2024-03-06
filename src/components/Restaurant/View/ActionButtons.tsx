import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import ContactModal from './ContactModal';
import { RootState, AppDispatch } from '../../../store/reducers';
import { createVCF } from '@/utilities/utils';
import { appDomain } from '@/setup/setup';
import { startLoading, stopLoading } from '@/store/reducers/loadingCenter';
import { setNotification } from '@/store/reducers/notificationCenter';
import { createContact } from '@/API/contact';
import { incrementAddedToContacts } from '@/API/restaurant';
import { openModal, closeModal } from '@/store/reducers/modal';
import { useActionButtonsStyles } from './styles';
import { RestaurantDataType } from '@/types/restaurant';

interface ActionButtonsProps {
  buttonStyles: {
    layout: string | null;
    buttonStyle: string | null;
  },
  restaurant: RestaurantDataType;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ buttonStyles, restaurant }) => {
  const classes = useActionButtonsStyles()
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn);
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = isLoggedIn && (authId === user?.id)
  const themeColorName = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.name : null
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : null
  const backgroundColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;


  const dispatch = useDispatch<AppDispatch>();

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isContactModalOpen = openModalName === 'connect';

  const downloadVCard = async () => {
    if (!restaurant) {
        return;
    }

    // Increment the addedToContacts count
    if (user && user.id && restaurant && restaurant.id && (!isLoggedIn || !isAccountOwner)) {
      await incrementAddedToContacts(user.id, restaurant.id); 
    }

    const vcfString = createVCF(restaurant, appDomain, user && user?.profileUrlSuffix ? user.profileUrlSuffix : '');
    const fileName = `${restaurant.basicInfoData?.firstName || ''}_${restaurant.basicInfoData?.lastName || ''}_Contacts`

    const blob = new Blob([vcfString], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleModalSubmit = async (data: any) => {
    if (user && user.id && restaurant && restaurant.id) {
      dispatch(startLoading('Sending contact info...'));
      data.isUnique = !isLoggedIn || !isAccountOwner
      const response = await createContact(user.id, restaurant.id, data);

      if (response.success) {
        dispatch(stopLoading());
        dispatch(setNotification({ message: 'Contact info sent successfully', type: 'success', horizontal: 'right', vertical: 'top' }));
      } else {
        dispatch(stopLoading());
        dispatch(setNotification({ message: response.error, type: 'error', horizontal: 'right', vertical: 'top' }));
      }
    }
  };

  return (
    <Box width="100%" pl={1} pr={1}>
      {buttonStyles.layout === 'divided' && (
        <Box sx={classes.actionButtonsContainer} display='flex' justifyContent='space-between' gap={2}>
          <Button
            variant="contained"
            onClick={() => dispatch(openModal('connect'))}
            sx={classes.actionButton}
            {...(backgroundColor ? { style: { backgroundColor } } : {})}
          >
            Connect
          </Button>
          <Button
            variant="contained"
            onClick={downloadVCard}
            sx={classes.actionButton}
            {...(backgroundColor ? { style: { backgroundColor } } : {})}
            aria-label={`Add ${restaurant?.basicInfoData?.firstName || ''} ${restaurant?.basicInfoData?.lastName || ''} to your phone contacts`}
          >
            Add to contacts
          </Button>
        </Box>
      )}
      {buttonStyles.layout === 'icon' && (
        <Box sx={classes.actionButtonsContainer} display='flex' justifyContent='space-between'>
          <Button
            variant="contained"
            onClick={() => dispatch(openModal('connect'))}
            sx={classes.actionButton}
            {...(backgroundColor ? { style: { backgroundColor } } : {})}
            aria-label={`Share your contact information with ${restaurant?.basicInfoData?.firstName || ''} ${restaurant?.basicInfoData?.lastName || ''}`}
          >
            Connect
          </Button>
          <Button variant="contained" sx={classes.actionButton} {...(backgroundColor ? { style: { backgroundColor } } : {})}>
            <AddIcCallIcon />
          </Button>
        </Box>
      )}
      <ContactModal
        open={isContactModalOpen}
        onClose={() => dispatch(closeModal())}
        onSubmit={handleModalSubmit}
        loadingData={false}
      />
    </Box>
  );
};

export default ActionButtons;
