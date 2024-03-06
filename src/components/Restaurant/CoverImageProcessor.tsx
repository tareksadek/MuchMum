import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Drawer, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { setNotification } from '@/store/reducers/notificationCenter';
import ImageCropper from './ImageCropper';
import { createImage } from '@/utilities/utils';
import { FirstReadImageDimensionsType, ImageType } from '@/types/restaurant';
import { AppDispatch, RootState } from '@/store/reducers';
import { useLayoutStyles } from '@/theme/layout';
import { useImageCropperStyles } from './styles';
import { openModal, closeModal } from '@/store/reducers/modal';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { CoverImagePlaceholderIcon } from '@/layout/CustomIcons';

interface CoverImageProps {
  data: ImageType | null;
  setData: React.Dispatch<React.SetStateAction<ImageType>>;
  cropWidth: number | null;
  cropHeight: number | null;
  isLoading?: boolean;
}

const CoverImageProcessor: React.FC<CoverImageProps> = ({
  data,
  setData,
  cropWidth,
  cropHeight,
  isLoading,
}) => {
  const classes = useImageCropperStyles()
  const layoutClasses = useLayoutStyles()
  const connectivity = useConnectivity();
  const [temporaryImageData, setTemporaryImageData] = useState<string | null>(null);
  const [firstReadImageDimensions, setFirstReadImageDimensions] = useState<FirstReadImageDimensionsType>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isImageCropperModalOpen = openModalName === 'coverImage';

  const closeProfileImageCropper = () => {
    dispatch(closeModal())
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png') {
        dispatch(setNotification({ message: 'Only JPG and PNG images are supported.', type: 'error', horizontal: 'right', vertical: 'top' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const tempData = e.target?.result as string;
        setTemporaryImageData(tempData);
  
        if (cropWidth && cropHeight) {
          const imageRes = await createImage(tempData);
          setFirstReadImageDimensions({ width: imageRes.width, height: imageRes.height })
        }
        
        dispatch(openModal('coverImage'))
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setData({
      url: null,
      blob: null,
      base64: null
    });
  }
  
  if (isLoading) {
    if (data && data.url) {
      return  (
        <Box sx={{ position: 'relative', width: '100%', height: 265 }}>
          <Image
            src={data.url}
            alt="restaurant"
            fill
            style={{objectFit: 'cover', maxWidth: cropWidth || 'initial' }}
          />
        </Box>
      )
    }
    return <div>Loading...</div>
  }
  
  return (
    <Box>
      {data && data.url ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={2}
        >
          <Box sx={classes.currentImageContainer} width="100%">
            <Box sx={{ position: 'relative', width: '100%', height: 265 }}>
              <Image
                src={data.url}
                alt="Restaurant cover"
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                  maxWidth: cropWidth || 'initial'
                }}
              />
            </Box>
            <IconButton
              sx={classes.delButtonContainer}
              onClick={handleRemoveImage}
              color="secondary"
            >
              <HighlightOffIcon />
            </IconButton>
          </Box>
          <Box mt={2} width="100%">
            <Button
              onClick={() => !connectivity.isOnline ? alert('Device is offline. You need to be online to change images.') : fileInputRef.current?.click()}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Change Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={2}
        >
          <Box 
            onClick={() => !connectivity.isOnline ? alert('Device is offline. You need to be online to change images.') : fileInputRef.current?.click()}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <CoverImagePlaceholderIcon
                style={{
                  fontSize: 100
                }}
              />
            </Box>
          </Box>
          <Box width="100%">
            <Button
              onClick={() => !connectivity.isOnline ? alert('Device is offline. You need to be online to change images.') : fileInputRef.current?.click()}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      )}

      <Drawer
        anchor="bottom"
        open={isImageCropperModalOpen}
        onClose={() => dispatch(closeModal())}
        // PaperProps={{
        //   className: layoutClasses.radiusBottomDrawer
        // }}
        sx={layoutClasses.radiusBottomDrawer}
      >
        <Box mt={2}>
          <ImageCropper
            selectedImage={temporaryImageData!}
            desiredWidth={cropWidth}
            desiredHeight={cropHeight}
            firstReadImageDimensions={firstReadImageDimensions}
            onCropComplete={(croppedImage) => {
              setData({
                url: croppedImage.croppedImageUrl,
                blob: croppedImage.croppedBlob,
                base64: croppedImage.base64
              });
              closeProfileImageCropper();
            }}
          />
        </Box>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButton}
          onClick={() => dispatch(closeModal())}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Box>
  );
}

export default React.memo(CoverImageProcessor);
