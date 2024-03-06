import React from 'react';
import { Button, Box } from '@mui/material';
import ThemeCreator from '../ThemeCreator';
import { ThemeSettingsType, ColorType } from '@/types/restaurant';
import { useStepsStyles } from './styles';

type StepFiveProps = {
  onNext: () => void;
  onPrev: () => void;
  data: ThemeSettingsType;
  setData: React.Dispatch<React.SetStateAction<ThemeSettingsType>>;
  favoriteColors?: ColorType[]; 
  setFavoriteColors?: React.Dispatch<React.SetStateAction<ColorType[]>>;
  isLastStep: boolean;
};

const StepFive: React.FC<StepFiveProps> = ({
  onNext,
  onPrev,
  data,
  setData,
  favoriteColors,
  setFavoriteColors,
  isLastStep,
}) => {
  const classes = useStepsStyles();
  return (
    <Box>
      <ThemeCreator
        data={data}
        setData={setData}
        favoriteColors={favoriteColors}
        setFavoriteColors={setFavoriteColors}
      />

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
};

export default StepFive;
