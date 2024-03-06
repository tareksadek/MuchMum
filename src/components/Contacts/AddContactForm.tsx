import React, { useEffect, useState } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { ContactType } from '@/types/contact';
import SaveButton from '@/layout/SaveButton';

interface ContactFormProps {
  isEdit?: boolean;
  isSave?: boolean;
  contact?: ContactType | null;
  onSubmit: (data: any) => Promise<void>;
  loadingData: boolean;
}

const AddContactForm: React.FC<ContactFormProps> = ({
  isEdit,
  isSave,
  contact,
  onSubmit,
  loadingData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      note: "",
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();

  const [formChanged, setFormChanged] = useState(false)

  useEffect(() => {
    if (contact && isEdit) {
      setValue('firstName', contact?.firstName || '');
      setValue('lastName', contact?.lastName || '');
      setValue('email', contact?.email || '');
      setValue('phone', contact?.phone || '');
      setValue('note', contact?.note || '');
    }
  }, [contact, setValue, isEdit]);

  useEffect(() => {
    if (contact && isEdit) {
      const { firstName, lastName, email, phone } = contact;
      const filteredContact = { firstName, lastName, email, phone };
      const hasChanged = JSON.stringify(filteredContact) !== JSON.stringify(watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, contact, isEdit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* FirstName Input */}
      <Controller
        name="firstName"
        control={control}
        rules={{ required: 'First name is required', minLength: { value: 2, message: 'Minimum length is 2 characters' } }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="First Name*"
            disabled={loadingData}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message as string}
          />
        )}
      />

      {/* LastName Input */}
      <Controller
        name="lastName"
        control={control}
        rules={{ minLength: { value: 2, message: 'Minimum length is 2 characters' } }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Last Name*\"
            disabled={loadingData}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message as string}
          />
        )}
      />

      {/* Email Input */}
      <Controller
        name="email"
        control={control}
        rules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email format"
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="E-mail"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.email)}
            helperText={errors.email?.message as string}
          />
        )}
      />

      {/* Phone Input */}
      <Controller
        name="phone"
        control={control}
        rules={{
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9+\-. ]+$/,
            message: "Invalid phone number."
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Phone Number*"
            disabled={loadingData}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message as string}
          />
        )}
      />

      <Controller
        name="note"
        control={control}
        rules={{ maxLength: 500 }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Note"
            multiline
            rows={6}
            InputProps={{
              endAdornment: loadingData ? <CircularProgress size={20} /> : null
            }}
            helperText={`${field.value.length}/500`}
            error={Boolean(errors.note)}
          />
        )}
      />

      {/* <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isValid || (isEdit && !formChanged)}
        fullWidth
      >
        {isEdit ? 'Update' : isSave ? 'Save' : 'Send'}
      </Button> */}
      <SaveButton
        type="submit"
        text={isEdit ? 'Update' : isSave ? 'Save' : 'Send'}
        disabled={!isValid || (isEdit && !formChanged)}
      />
    </form>
  );
};

export default AddContactForm;
