import React from 'react';
import { Button, Box } from '@mui/material';
import LinksCreator from '../LinksCreator';
import { LinkType } from '@/types/restaurant';
import { useStepsStyles } from './styles';

interface StepFourProps {
  onNext: () => void;
  onPrev: () => void;
  links: {
    social: LinkType[];
    custom: LinkType[];
  };
  setLinks: React.Dispatch<React.SetStateAction<{
    social: LinkType[];
    custom: LinkType[];
  }>>;
  isLastStep: boolean;
}


const StepFour: React.FC<StepFourProps> = ({
  onNext,
  onPrev,
  links,
  setLinks,
  isLastStep,
}) => {
  const classes = useStepsStyles();
  const processLinks = () => {
    onNext()
  };

  return (
    <Box>
      <LinksCreator
        setLinks={setLinks}
        links={links}
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
          onClick={processLinks}
        >
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}

export default StepFour;
