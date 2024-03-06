import React from 'react';
import { Typography, Button, TextField, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { UserType } from '../../../types/user';

interface StepZeroProps {
  formStatedata: string | null;
  onSubmit: (formStatedata: string) => void;
  currentUser: UserType | null;
  loadingUser: boolean;
}

const StepZero: React.FC<StepZeroProps> = ({ formStatedata, onSubmit, currentUser, loadingUser }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      title: formStatedata || '',
    },
    mode: 'onBlur',
  });
  

  return (
    <form
      onSubmit={handleSubmit(formData => {
        onSubmit(formData.title)
      })}
    >
      <Box mt={2}>
        <Typography variant="h4" align="center">Card title</Typography>
      </Box>

      <div>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Card title is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Card Title*"
              disabled={loadingUser && !formStatedata}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          )}
        />
        <Typography color="error">
          {errors.title && errors.title.message}
        </Typography>
      </div>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
        disabled={!isValid}
      >
        Next
      </Button>
    </form>
  );
}

export default StepZero;
