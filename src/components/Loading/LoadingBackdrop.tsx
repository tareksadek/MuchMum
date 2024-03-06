import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress, Typography, Box } from '@mui/material';
import {
  BackdropStyled,
  LoadingBoxStyled,
  ProgressContainerStyled,
  ProgressMessageStyled,
  ProgressPercentageContainerStyled,
  useCubeStyles,
} from './LoadingBackdropStyles'; // Adjust this path to your actual file
import { RootState } from '../../store/reducers';

interface LoadingBackdropProps {
  withoutProgress?: boolean;
  clicked?: () => void;
  withOpacity?: boolean;
  done?: boolean;
  boxed?: boolean;
  cubed?: boolean;
  onComplete?: () => void;
  message?: string;
}

const LoadingBackdrop: React.FC<LoadingBackdropProps> = ({
  withoutProgress = false,
  clicked,
  withOpacity = false,
  done = false,
  boxed = false,
  cubed = false,
  onComplete,
  message,
}) => {
  const classes = useCubeStyles()
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const currentLoadingMessage = useSelector((state: RootState) => {
    const messages = state.loadingCenter.loadingMessages;
    return messages[messages.length - 1] || '';
  });

  const lastProcessedMessageRef = useRef(currentLoadingMessage);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [currentLoadingMessage]);  

  useEffect(() => {
    if (lastProcessedMessageRef.current !== currentLoadingMessage) {
      setProgress(0);
      lastProcessedMessageRef.current = currentLoadingMessage;
    }
  }, [currentLoadingMessage]); 
  
  useEffect(() => {
    // Reset progress when a message is added or removed
    if (isLoading && progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          } else if (prev < 100) {
            return 100;
          } else {
            return prev;
          }
        });
      }, 100);
      return () => clearInterval(timer);
    } else if (!isLoading && progress < 100) {
      setProgress(100);  // If not loading, make sure the progress goes to 100
    }
  }, [isLoading, progress]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  if (!isLoading && progress === 100) return null;

  if (cubed) {
    return (
      <Box sx={classes.backdropContainer}>
        <Box sx={classes.cubeWrapper}>
          <Box sx={classes.cubeFolding}>
            <Box sx={classes.leaf1}></Box>
            <Box sx={classes.leaf2}></Box>
            <Box sx={classes.leaf3}></Box>
            <Box sx={classes.leaf4}></Box>
          </Box>
          <Typography variant="body1" align="center" sx={classes.loading}>{message || currentLoadingMessage}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <BackdropStyled boxed={boxed} onClick={() => (clicked ? clicked() : null)}>
      {!withoutProgress && (
        <LoadingBoxStyled>
          <Typography component={ProgressMessageStyled}>
            {message || currentLoadingMessage}
          </Typography>
          <Box display="flex" alignItems="center" minWidth="100%">
            <Box width="100%" component={ProgressContainerStyled}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box minWidth={35} component={ProgressPercentageContainerStyled}>
              <Typography variant="body2" color="textSecondary">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
        </LoadingBoxStyled>
      )}
    </BackdropStyled>
  );
};

export default LoadingBackdrop;