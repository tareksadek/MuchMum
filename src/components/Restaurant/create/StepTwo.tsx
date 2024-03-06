import React from 'react';
import { Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AboutFormDataTypes } from '@/types/restaurant';
import AboutForm from '../AboutForm';
import { UserType } from '@/types/user';
import { useStepsStyles } from './styles';

interface StepTwoProps {
  onPrev: () => void;
  formStatedata: AboutFormDataTypes | null;
  onSubmit: (formStatedata: Partial<AboutFormDataTypes>) => void;
  currentUser: UserType | null;
  isLastStep: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formStatedata,
  onSubmit,
  onPrev,
  currentUser,
  isLastStep,
}) => {
  const classes = useStepsStyles();
  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<AboutFormDataTypes>();

  return (
    <form onSubmit={handleSubmit(formData => {
      onSubmit(formData)
    })}>
      <AboutForm
        formStatedata={formStatedata}
        loadingData={false}
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
        defaultData={null}
        currentUser={currentUser}
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
        >
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </form>
  );
}

export default StepTwo;
