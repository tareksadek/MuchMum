import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  lazy,
  Suspense
} from 'react';
import _ from 'lodash';
import { Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '@/store/reducers';
import { BasicInfoFormDataTypes } from '@/types/restaurant';
import { useRegisterSubmit, SubmitContext } from '@/contexts/SubmitContext';
import { updateBasicInfo } from '@/store/reducers/restaurant';
import { useLayoutStyles } from '@/theme/layout';
import SaveButton from '@/layout/SaveButton';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import AppLayout from '@/layout/AppLayout';

const BasicInfoForm = lazy(() => import('@/components/Restaurant/BasicInfoForm'));

const BasicInfo: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, isLoggedIn, currentUser } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  const { control, register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<BasicInfoFormDataTypes>({
    defaultValues: {
      firstName: restaurant && restaurant.basicInfoData?.firstName ? restaurant.basicInfoData?.firstName : '',
      lastName: restaurant && restaurant.basicInfoData?.lastName ? restaurant.basicInfoData?.lastName : '',
      email: restaurant && restaurant.basicInfoData?.email? restaurant.basicInfoData?.email : '',
      phone1: restaurant && restaurant.basicInfoData?.phone1 ? restaurant.basicInfoData?.phone1 : '',
      phone2: restaurant && restaurant.basicInfoData?.phone2 ? restaurant.basicInfoData?.phone2 : '',
      address: restaurant && restaurant.basicInfoData?.address ? restaurant.basicInfoData?.address : '',
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();  

  useEffect(() => {
    if (restaurant) {
      setValue('firstName', restaurant.basicInfoData?.firstName || '');
      setValue('lastName', restaurant.basicInfoData?.lastName || '');
      setValue('email', restaurant.basicInfoData?.email || '');
      setValue('phone1', restaurant.basicInfoData?.phone1 || '');
      setValue('phone2', restaurant.basicInfoData?.phone2 || '');
      setValue('address', restaurant.basicInfoData?.address || '');
      setLocation(restaurant.basicInfoData?.location || null)
    }
  }, [restaurant, setValue]);

  useEffect(() => {
    if (restaurant && restaurant?.basicInfoData && restaurant.basicInfoData.address) {
      setCurrentAddress(restaurant.basicInfoData.address)
    }
    if (restaurant && restaurant?.basicInfoData && restaurant.basicInfoData.location) {
      setLocation(restaurant.basicInfoData.location)
    }
  }, [restaurant]);

  const handleBasicInfoSubmit = useCallback((formData: Partial<BasicInfoFormDataTypes>) => {
    if (!userId || !currentUser) {
      return;
    }
    console.log(formData)
    formData.location = location
    dispatch(updateBasicInfo({userId, restaurantId: currentUser.activeRestaurantId, formData}));
  }, [userId, dispatch, currentUser, location]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleBasicInfoSubmit)());
  }, [registerSubmit, handleSubmit, handleBasicInfoSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);  

  useEffect(() => {
    if (restaurant && restaurant.basicInfoData) {
      const restaurantDataWithoutLocation = _.omit(restaurant.basicInfoData, 'location');      
      const hasChanged = !_.isEqual(restaurantDataWithoutLocation, watchedValues);
      
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, restaurant]);

  return (
    <AppLayout>
      <Box p={2}>
        <form onSubmit={handleSubmit(handleBasicInfoSubmit)}>
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
            <BasicInfoForm
              formStatedata={restaurant && restaurant?.basicInfoData ? restaurant?.basicInfoData : null}
              location={location}
              setLocation={setLocation}
              loadingData={isLoading}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              defaultData={null}
              currentUser={currentUser}
              currentAddress={currentAddress}
            />
          </Suspense>
          <Box
            sx={layoutClasses.stickyBottomBox}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <SaveButton
              type="submit"
              text = "Save"
              disabled={!formValid || !formChanged}
            />
          </Box>
        </form> 
      </Box>
    </AppLayout>
  );
}

export default BasicInfo;
