import type { AppProps } from 'next/app';
import { wrapper } from '@/store/reducers/';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import { SubmitProvider } from '@/contexts/SubmitContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <SubmitProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </SubmitProvider>
    </ThemeProvider>
  )
}

export default wrapper.withRedux(MyApp);