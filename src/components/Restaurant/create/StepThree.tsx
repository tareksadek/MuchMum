import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography, Box } from '@mui/material';
import ProfileImageProcessor from '../ProfileImageProcessor';
import CoverImageProcessor from '../CoverImageProcessor';
import { profileImageDimensions, coverImageDimensions } from '@/setup/setup';
import { UserType } from '@/types/user';
import { ImageType } from '@/types/restaurant';
import { RootState } from '@/store/reducers';
import { useStepsStyles } from './styles';

interface StepThreeProps {
  onNext: () => void;
  onPrev: () => void;
  coverImageData: ImageType | null;
  setCoverImageData: React.Dispatch<React.SetStateAction<ImageType>>;
  initialCoverImage?: string | null;
  profileImageData: ImageType | null;
  setProfileImageData: React.Dispatch<React.SetStateAction<ImageType>>;
  initialProfileImage?: string | null;
  currentUser: UserType | null;
  isLastStep: boolean;
}

const StepThree: React.FC<StepThreeProps> = ({
  onNext,
  onPrev,
  coverImageData,
  setCoverImageData,
  initialCoverImage,
  profileImageData,
  setProfileImageData,
  initialProfileImage,
  currentUser,
  isLastStep,
}) => {
  const classes = useStepsStyles();
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  
  useEffect(() => {
    if (initialCoverImage && coverImageData && !coverImageData.url) {
      setCoverImageData({
        url: initialCoverImage,
        // blob: null,
        base64: null
      });
    }
    if (initialProfileImage && profileImageData && !profileImageData.url) {      
      setProfileImageData({
        url: initialProfileImage,
        blob: null,
        base64: null
      });
    }
  }, [
    coverImageData,
    setCoverImageData,
    initialCoverImage,
    profileImageData,
    setProfileImageData,
    initialProfileImage,
  ]);

  return (
    <Box>
      <Box pb={2}>
        <Typography variant="h4" align="center">Restaurant Logo</Typography>
        <ProfileImageProcessor
          data={profileImageData}
          setData={setProfileImageData}
          cropWidth={profileImageDimensions.width}
          cropHeight={profileImageDimensions.height}
        />
      </Box>

      {currentUser
      && (!currentUser.isTeamMember || (currentUser.isTeamMember && currentUser.isTeamMaster))
      && appSetup
      && (!appSetup.coverImageData || (appSetup.coverImageData && !appSetup.coverImageData.url))
      && (
        <Box mt={2} mb={2}>
          <Typography variant="h4" align="center">Cover Photo</Typography>
          <CoverImageProcessor
            data={coverImageData}
            setData={setCoverImageData}
            cropWidth={coverImageDimensions.width}
            cropHeight={coverImageDimensions.height}
          />
        </Box>
      )}

      <Box
        sx={classes.stickyBox}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          onClick={onPrev}
          variant="outlined"
          color="primary"
        >
          Previous
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={onNext}
        >
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(StepThree);
