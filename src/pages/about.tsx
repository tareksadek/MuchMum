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
import { AboutFormDataTypes } from '@/types/restaurant';
import { useRegisterSubmit, SubmitContext } from '@/contexts/SubmitContext';
import { updateAboutInfo } from '@/store/reducers/restaurant';
import { useLayoutStyles } from '@/theme/layout';
import SaveButton from '@/layout/SaveButton';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';
import AppLayout from '@/layout/AppLayout';

const AboutForm = lazy(() => import('@/components/Restaurant/AboutForm'));

const About: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const { control, register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<AboutFormDataTypes>({
    defaultValues: {
      about: restaurant && restaurant.aboutData?.about ? restaurant.aboutData?.about : '',
      videoUrl: restaurant && restaurant.aboutData?.videoUrl ? restaurant.aboutData?.videoUrl : '',
    },
    mode: 'onBlur',
  });
  const watchedValues = watch();  

  useEffect(() => {
    if (restaurant) {
      setValue('about', restaurant.aboutData?.about || '');
      setValue('videoUrl', restaurant.aboutData?.videoUrl || '');
    }
  }, [restaurant, setValue]);

  useEffect(() => {
    if (restaurant && restaurant?.aboutData && restaurant.aboutData.videoUrl) {
      setCurrentVideo(restaurant.aboutData.videoUrl)
    }
  }, [restaurant]);

  const handleAboutSubmit = useCallback((formData: Partial<AboutFormDataTypes>) => {
    if (!userId || !currentUser) {
      return;
    }
    dispatch(updateAboutInfo({ userId, restaurantId: currentUser.activeRestaurantId, formData }));
  }, [userId, dispatch, currentUser]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleAboutSubmit)());
  }, [registerSubmit, handleSubmit, handleAboutSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  useEffect(() => {
    if (restaurant && restaurant.aboutData) {
      const hasChanged = !_.isEqual(restaurant.aboutData, watchedValues);
      setFormChanged(hasChanged);
    }
  }, [watchedValues, setFormChanged, restaurant]);

  return (
    <AppLayout>
      <Box p={2}>
        <form onSubmit={handleSubmit(handleAboutSubmit)}>
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
            <AboutForm
              formStatedata={restaurant && restaurant?.aboutData ? restaurant?.aboutData : null}
              loadingData={isLoading}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              defaultData={null}
              currentUser={currentUser}
              currentVideo={currentVideo}
            />
          </Suspense>
          {/* {formChanged && ( */}
            <Box
              sx={layoutClasses.stickyBottomBox}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!formValid || !formChanged}
              >
                Save
              </Button> */}
              <SaveButton
                // onClick={handleThemeSubmit}
                type="submit"
                text = "Save"
                disabled={!formValid || !formChanged}
              />
            </Box>
          {/* )} */}
        </form> 
      </Box>
    </AppLayout>
  );
}

export default About;