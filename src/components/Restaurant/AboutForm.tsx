import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, TextField, CircularProgress, Box, Alert } from '@mui/material';
import { Controller } from 'react-hook-form';
import ReactPlayer from 'react-player';
import { isValidVideoUrl } from '@/utilities/utils';
import validator from 'validator';
import { AboutFormDataTypes } from '@/types/restaurant';
import { UserType } from '../../types/user';
import { RootState } from '../../store/reducers';
import { useConnectivity } from '../../contexts/ConnectivityContext';

interface AboutProps {
  formStatedata: AboutFormDataTypes | null;
  control: any;
  register: any;
  loadingData: boolean;
  setValue: any;
  errors: any;
  defaultData: any;
  currentUser: UserType | null;
  currentVideo?: string | null;
}

const AboutForm: React.FC<AboutProps> = ({
  formStatedata,
  loadingData,
  control,
  register,
  setValue,
  errors,
  defaultData,
  currentUser,
  currentVideo,
}) => {
  const connectivity = useConnectivity();
  const appSetup = useSelector((state: RootState) => state.setup.setup);
  const [videoUrl, setVideoUrl] = useState(formStatedata?.videoUrl || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleVideoUrlChange = (url: string, field?: any) => {
    setVideoUrl(url);

    if (field) {
        field.onChange(url);
    }

    if (!validator.isURL(url)) {
        setFeedback('Invalid URL format.');
        return;
    }

    if (!isValidVideoUrl(url)) {
        setFeedback('We only support YouTube, Vimeo, Facebook, Sound Cloud, Streamable, Twitch, Daily Motion and Mix Cloud.');
        return;
    }

    setFeedback(null);
  };

  useEffect(() => {
    if (currentVideo) {
      handleVideoUrlChange(currentVideo)
    }
  }, [currentVideo]);

  return (
    <Box>
      {appSetup && appSetup.aboutData && !appSetup.aboutData.about && (
        <Box>
          <Box mt={2}>
            <Typography variant="h4" align="center">{`About ${currentUser?.fullName}`}</Typography>
          </Box>

          <Controller
            name="about"
            control={control}
            defaultValue={formStatedata?.about || ''}
            rules={{ maxLength: 500 }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                margin="normal"
                fullWidth
                label="About"
                multiline
                rows={6}
                InputProps={{
                  endAdornment: loadingData ? <CircularProgress size={20} /> : null
                }}
                helperText={errors.about ? "Your biography must not exceed 500 characters." : `${field.value.length}/500`}
                error={Boolean(errors.about)}
              />
            )}
          />
        </Box>
      )}

      {appSetup && appSetup.aboutData && !appSetup.aboutData.videoUrl && (
        <Box>
          <Controller
            name="videoUrl"
            control={control}
            defaultValue={formStatedata?.videoUrl || ''}
            render={({ field }) => (
              <TextField
                {...field}
                value={videoUrl}
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  endAdornment: loadingData ? <CircularProgress size={20} /> : null
                }}
                label="Video URL"
                onChange={(e) => handleVideoUrlChange(e.target.value, field)}
              />
            )}
          />

          {!connectivity.isOnline && (
            <Box>
              <Alert severity="warning">
                You are currently offline. Please reconnect to view the video content.
              </Alert>
            </Box>
          )}
          {isValidVideoUrl(videoUrl) && connectivity.isOnline && (
            <ReactPlayer url={videoUrl} width="100%" />
          )}
          {feedback && <Typography color="error">{feedback}</Typography>}
        </Box>
      )}
    </Box>
  );
}

export default AboutForm;
