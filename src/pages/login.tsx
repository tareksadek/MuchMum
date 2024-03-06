import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useForm } from 'react-hook-form';
import { AppDispatch } from '@/store/reducers';
import { setNotification } from '@/store/reducers/notificationCenter';
import { getAuthErrorMessage } from '@/utilities/utils';
import { getUserById } from '@/API/user';
import { UserType } from '@/types/user';
import GuestRoute from '@/hoc/GuestRoute';

interface FirebaseError extends Error {
  code: string;
}

type ResponseType = {
  success: boolean;
  data?: UserType;
  error?: string;
};

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm();
  const router = useRouter();

  const handleSignInSuccess = async (userCredential: any, auth: any) => {
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const userResponse = await getUserById(auth.currentUser?.uid) as ResponseType;
    if (idTokenResult.claims.admin) {
      router.push('/AdminDashboard');
    } else if (userResponse.success && userResponse.data && userResponse.data.restaurantList && userResponse.data.restaurantList.length > 0) {
      router.push(`/${userResponse.data.profileUrlSuffix}`);
    } else {
      router.push('/CreateRestaurant');
    }
  };  

  const signInWithEmail = async (email: string, password: string) => {
    const auth = getAuth();
      
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSignInSuccess(userCredential, auth)
    } catch (err) {      
      const message = getAuthErrorMessage((err as FirebaseError).code);
      dispatch(setNotification({ 
        message: message, 
        type: 'error', 
        horizontal: 'right', 
        vertical: 'top' 
      }));
    }
  };  

  const onSubmit = (data: any) => {
    const { email, password } = data;
    signInWithEmail(email, password);
  };

  const goToResetPassword = () => {
    router.push('/forgotPassword');
  }

  return (
    <GuestRoute>
      <Container maxWidth="xs">
        <Box pt={2}>
          <Typography variant="h4" align="center">Login</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                required: "Password is required"
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
              Login
            </Button>
            <Box mt={1}>
              <Button
                onClick={goToResetPassword}
                fullWidth
              >
                Forgot Password?
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </GuestRoute>
  );
}

export default Login;
