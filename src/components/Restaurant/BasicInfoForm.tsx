import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { setKey, fromAddress } from 'react-geocode';
import debounce from 'lodash/debounce';
import { Typography, TextField, CircularProgress, Box, Alert } from '@mui/material';
import { Controller } from 'react-hook-form';
import { GOOGLE_MAPS_KEY } from '@/setup/setup';
import { BasicInfoFormDataTypes } from '@/types/restaurant';
import { UserType } from '../../types/user';
import { RootState } from '../../store/reducers';
import { useConnectivity } from '../../contexts/ConnectivityContext';

const GoogleMapDisplay = lazy(() => import('./GoogleMapDisplay'));

interface BasicInfoProps {
  formStatedata: BasicInfoFormDataTypes | null;
  location: {
    lat: number,
    lng: number
  } | null;
  setLocation: (location: { lat: number, lng: number } | null) => void;
  control: any;
  register: any;
  loadingData: boolean;
  setValue: any;
  errors: any;
  currentUser: UserType | null;
  defaultData: any;
  currentAddress?: string | null;
  teamInfo?: boolean;
  masterInfo?: boolean;
  memberInfo?: boolean;
}

console.log(GOOGLE_MAPS_KEY);


setKey(GOOGLE_MAPS_KEY);

const BasicInfoForm: React.FC<BasicInfoProps> = ({
  formStatedata,
  loadingData,
  control,
  setValue,
  errors,
  currentUser,
  currentAddress,
  location,
  setLocation,
  teamInfo,
  masterInfo,
  memberInfo,
}) => {
  const connectivity = useConnectivity();
  const [mapError, setMapError] = useState<string | null>(null)
  const [address, setAddress] = useState('');
  const appSetup = useSelector((state: RootState) => state.setup.setup);

  const handleAddressChange = (address: string) => {
    setAddress(address);
  };

  useEffect(() => {
    const debouncedFetchLocation = debounce(async (address) => {
      try {
        const response = await fromAddress(address);
        const { lat, lng } = response.results[0].geometry.location;
        setLocation({ lat, lng });
        setMapError(null);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching location:", error.message);
          setMapError("We couldn't find that address. Please check and try again.");
        }
        setLocation(null);
      }
    }, 1000);

    if (address) {
      debouncedFetchLocation(address);
    }

    return () => debouncedFetchLocation.cancel();

  }, [address, setLocation]);

  return (
    <Box>
      {!teamInfo && (
        <Controller
          name="firstName"
          control={control}
          rules={{ required: 'Restaurant name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Restaurant Name*"
              disabled={loadingData && !formStatedata?.firstName}
              InputProps={{
                endAdornment: loadingData && !formStatedata?.firstName ? <CircularProgress size={20} /> : null
              }}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName?.message}
            />
          )}
        />
      )}
      
      {/* <Typography color="error">
        {errors.firstName && errors.firstName.message}
      </Typography> */}

      {!teamInfo && (
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Restaurant Name Slug"
              disabled={loadingData}
              InputProps={{
                endAdornment: loadingData ? <CircularProgress size={20} /> : null
              }}
            />
          )}
        />
      )}
      
      {/* <Typography color="error">
        {errors.lastName && errors.lastName.message}
      </Typography> */}

      {!teamInfo && (
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
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
              label="E-mail*"
              disabled={loadingData}
              InputProps={{
                endAdornment: loadingData ? <CircularProgress size={20} /> : null
              }}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          )}
        />
      )}

      {!teamInfo && (
        <Controller
          name="phone1"
          control={control}
          rules={{
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
              label="Phone Number 1"
              disabled={loadingData}
              InputProps={{
                endAdornment: loadingData ? <CircularProgress size={20} /> : null
              }}
              error={Boolean(errors.phone1)}
              helperText={errors.phone1?.message}
            />
          )}
        />
      )}

      {!teamInfo && (
        <Controller
          name="phone2"
          control={control}
          rules={{
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
              label="Phone Number 2"
              disabled={loadingData}
              InputProps={{
                endAdornment: loadingData ? <CircularProgress size={20} /> : null
              }}
              error={Boolean(errors.phone2)}
              helperText={errors.phone2?.message}
            />
          )}
        />
      )}
      
      {appSetup && appSetup.basicInfoData && !appSetup.basicInfoData.address && (!currentUser?.isTeamMember || (currentUser.isTeamMember && currentUser.isTeamMaster)) && !masterInfo && !memberInfo && (
        <>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Address"
                error={Boolean(errors.address)}
                disabled={loadingData}
                InputProps={{
                  endAdornment: loadingData ? <CircularProgress size={20} /> : null
                }}
                helperText={errors.address?.message}
                onChange={e => {
                  field.onChange(e);
                  handleAddressChange(e.target.value);
                }}
              />
            )}
          />
          {!connectivity.isOnline && (
            <Box>
              <Alert severity="warning">
                You are currently offline. Please reconnect to view the map.
              </Alert>
            </Box>
          )}
          {location && connectivity.isOnline && (
            <Suspense
              fallback={(
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  p={2}
                >
                  <Typography align='center' variant='body1'>Loading...</Typography>
                </Box>
              )}
            >
              <GoogleMapDisplay lat={location.lat} lng={location.lng} />
            </Suspense>
          )}
          {mapError && connectivity.isOnline && (
            <Typography color="error">
              {mapError}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default BasicInfoForm;
