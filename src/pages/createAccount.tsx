import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getAuth, createUserWithEmailAndPassword, User } from '@firebase/auth';
import { Timestamp } from '@firebase/firestore';
import { useForm } from 'react-hook-form';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import { createUserDocument, doesUserWithProfileSuffixExist } from '@/API/user';
import { AppDispatch } from '@/store/reducers';
import { generateRandomString, cleanString } from '@/utilities/utils';
import { appDomainView } from '@/setup/setup';
// import { fetchSetup } from '@/store/reducers/setup';
// import { selectSetup } from '@/store/selectors/setup';
import GuestRoute from '@/hoc/GuestRoute';
import RestaurantURL from '@/components/CreateAccount/RestaurantURL';

const CreateAccount: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // const { setup, loadingSetup } = useSelector(selectSetup);

  const [suffixError, setSuffixError] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
  });
  const watchedFirstName = watch('firstName');
  const watchedLastName = watch('lastName');

  // useEffect(() => {
  //   if (!setup && !loadingSetup) {
  //     console.log('fetching setup ca')
  //     dispatch(fetchSetup());
  //   }
  // }, [dispatch, setup, loadingSetup]);

  const handlePostSignupActions = async (
    user: User,
    firstName: string,
    lastName: string,
    loginMethod: string
  ) => {
    const docData = {
      accountSecret: generateRandomString(),
      createdOn: Timestamp.now().toDate(),
      loginEmail: user.email || '',
      lastLogin: Timestamp.now().toDate(),
      viaInvitation: false,
      isActive: true,
      profileUrlSuffix: `${cleanString(firstName.trim().toLowerCase())}_${cleanString(lastName.trim().toLowerCase())}`,
      firstName,
      lastName,
      fullName: `${firstName || ''} ${lastName || ''}`,
      loginMethod: loginMethod,
      isAdmin: false,
      redirect: {
        active: false,
        url: ''
      },
    };
    const response = await createUserDocument(user.uid, docData);
    if (response.success) {
      router.push('/CreateRestaurant');
    } else {
      console.error("Error creating document:", response.error);
    }
  }

  const onSubmit = async (data: any) => {
    const { email, password, firstName, lastName } = data;
    try {
      const auth = getAuth();
      const requiredSuffix = `${cleanString(firstName.trim().toLowerCase())}_${cleanString(lastName.trim().toLowerCase())}`
      const userWithSuffix = await doesUserWithProfileSuffixExist(requiredSuffix)
      if (userWithSuffix && userWithSuffix.exists) {
        setSuffixError(true)
        return
      }
      setSuffixError(false)
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      if (user) {
        await handlePostSignupActions(user, firstName, lastName, 'email');
      }
    } catch (err) {      
      console.error((err as Error).message);
    }
  };

  const profileUrl = `${appDomainView}/${watchedFirstName ? cleanString(watchedFirstName.trim().toLowerCase()) : 'Restaurant Name'}${watchedLastName ? `_${cleanString(watchedLastName.trim().toLowerCase())}` : ''}`;

  return (
    <GuestRoute>
      <Container>
        <Box pt={2}>
          <Typography variant="h3" align="center">Welcome to Contact Dynamics</Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt={2}
            mb={2}
          >
            <Image
              src="/images/welcome.svg"
              alt="Welcome to MuchMuM"
              priority
              width={256}
              height={229}
            />
          </Box>
          <Typography variant="h4" align="center">Create Account</Typography>
          {suffixError && (
            <Box mt={2}>
              <Alert severity="warning">
                <Box display="flex" gap={1}>
                  An account with this card identifier [{`${watchedFirstName.toLowerCase()}_${watchedLastName.toLowerCase()}`}] already exists. Please choose a different one or contact support if you believe this is an error.
                </Box>
              </Alert>
            </Box>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("firstName", { required: "Restaurant name is required" })}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Restaurant Name*"
            />
            <Typography color="error">
              {typeof errors.firstName?.message === 'string' ? errors.firstName.message : null}
            </Typography>

            <TextField
              {...register("lastName")}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Restaurant Name Slug"
            />

            <RestaurantURL profileUrl={profileUrl} />

            <TextField
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email format"
                }
              })}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email Address"
              type="email"
            />
            <Typography color="error">
              {typeof errors.email?.message === 'string' ? errors.email.message : null}
            </Typography>

            <TextField
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters long" }
              })}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
            />
            <Typography color="error">
              {typeof errors.password?.message === 'string' ? errors.password.message : null}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!isValid}
            >
              Sign Up
            </Button>
          </form>       
        </Box>
      </Container>
    </GuestRoute>
  );
}

export default CreateAccount;
