import React, { lazy, Suspense } from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Header = lazy(() => import('./Header'));
const About = lazy(() => import('../About'));
const ActionButtons = lazy(() => import('../ActionButtons'));
const CustomLinks = lazy(() => import('../CustomLinks'));
const SocialLinks = lazy(() => import('../SocialLinks'));
const Video = lazy(() => import('../Video'));
const Info = lazy(() => import('../Info'));

const Layout: React.FC<{ restaurant: any }> = ({ restaurant }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Suspense
        fallback={(
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={2}
            width="100%"
          >
            <Stack
              spacing={1}
              width="100%"
              alignItems="center"
            >
              <Skeleton variant="rounded" width="100%" height={250} />
              <Skeleton variant="circular" width={80} height={80} />
            </Stack>
          </Box>
        )}
      >
        <Header restaurant={restaurant} />
      </Suspense>

      {restaurant.aboutData.about && (
        <Box mt={2} mb={2} width="100%">
          <Suspense
            fallback={(
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                p={2}
              >
                <Stack
                  spacing={1}
                  width="100%"
                  alignItems="center"
                >
                  <Skeleton variant="text" width="100%" height={100} />
                </Stack>
              </Box>
            )}
          >
            <About restaurant={restaurant} />
          </Suspense>
        </Box>
      )}

      <Box mt={2} mb={2} width="100%">
        <Suspense
          fallback={(
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              p={2}
            >
              <Stack
                width="100%"
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
                gap={2}
              >
                <Skeleton variant="rounded" width="100%" height={50} />
                <Skeleton variant="rounded" width="100%" height={50} />
              </Stack>
            </Box>
          )}
        >
          <ActionButtons
            buttonStyles={{
              layout: 'divided',
              buttonStyle: 'rounded'
            }}
            restaurant={restaurant}
          />

        </Suspense>
      </Box>

      {restaurant.links && restaurant.links.social && restaurant.links.social.length > 0 && (
        <Box mt={2} mb={2} width="100%">
          <Suspense
            fallback={(
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                p={2}
              >
                <Stack
                  width="100%"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="center"
                  gap={2}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                </Stack>
              </Box>
            )}
          >
            <SocialLinks
              linksStyles={{
                socialLinksStyle: 'rounded',
              }}
              restaurant={restaurant}
            />
          </Suspense>
        </Box>
      )}

      {restaurant.links && restaurant.links.custom && restaurant.links.custom.length > 0 && (
        <Box mt={2} mb={2} width="100%">
          <Suspense
            fallback={(
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                p={2}
              >
                <Stack
                  spacing={1}
                  width="100%"
                  alignItems="center"
                >
                  <Skeleton variant="text" width="100%" height={50} />
                  <Skeleton variant="text" width="100%" height={50} />
                </Stack>
              </Box>
            )}
          >
            <CustomLinks restaurant={restaurant} />
          </Suspense>
        </Box>
      )}

      {restaurant.aboutData.videoUrl && (
        <Box mt={2} mb={2} width="100%">
          <Suspense
            fallback={(
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                p={2}
              >
                <Stack
                  spacing={1}
                  width="100%"
                  alignItems="center"
                >
                  <Skeleton variant="text" width="100%" height={250} />
                </Stack>
              </Box>
            )}
          >
            <Video restaurant={restaurant} />
          </Suspense>
        </Box>
      )}

      <Box mt={2} width="100%">
        <Suspense
          fallback={(
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              p={2}
            >
              <Stack
                spacing={1}
                width="100%"
                alignItems="center"
              >
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="100%" height={230} />
              </Stack>
            </Box>
          )}
        >
          <Info restaurant={restaurant} />
        </Suspense>
      </Box>
    </Box>
  );
};

export default Layout;
