import React, { useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import Cropper from 'react-easy-crop';
import { getCroppedAndCompressedImg } from '../../utilities/utils';
import { CroppedArea } from '@/types/restaurant';

interface ImageCropperProps {
  selectedImage: string;
  firstReadImageDimensions: {
    width: number,
    height: number
  } | null;
  desiredWidth: number | null;
  desiredHeight: number | null;
  onCropComplete: (croppedImage: { croppedImageUrl: string, croppedBlob: Blob, base64: string }) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  selectedImage,
  firstReadImageDimensions,
  onCropComplete,
  desiredWidth,
  desiredHeight,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: CroppedArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirmCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedAndCompressedImg(selectedImage, croppedAreaPixels, desiredWidth ?? undefined, desiredHeight ?? undefined);
      onCropComplete(croppedImage);
    }
  };

  const aspectRatio = desiredWidth && desiredHeight ? desiredWidth / desiredHeight : 1;

  return (
    <>
      {(desiredWidth && desiredHeight) && firstReadImageDimensions && (firstReadImageDimensions.width < desiredWidth || firstReadImageDimensions.height < desiredHeight) && (
        <Box maxWidth={565} display="flex" alignItems="center" justifyContent="center" p={1} style={{ margin: '0 auto' }}>
          <Alert severity="warning">
            The uploaded image is too small and may not look good when resized. Please consider using a larger image.
          </Alert>
        </Box>
      )}
      <Box
        style={{
          // width: desiredWidth || '100%',
          width: '100%',
          height: desiredHeight || 'auto',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <Cropper
          image={selectedImage}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          style= {{
            containerStyle: {
              maxWidth: desiredWidth || '100%',
              maxHeight: desiredHeight || 'auto',
              margin: 'auto',
            }
          }}
        />
      </Box>
      <Box
        mt={2}
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirmCrop}
          style={{
            maxWidth: 550
          }}
        >
          Confirm Crop
        </Button>
      </Box>
    </>
  );
};

export default ImageCropper;

