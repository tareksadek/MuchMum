import { Container } from "@mui/material";
import { ReactNode } from 'react';
import { useAppStyles } from './appStyles';

interface AppContentContainerProps {
  children: ReactNode;
}

const AppContentContainer: React.FC<AppContentContainerProps> = ({ children }) => {
  const { contentContainer } = useAppStyles();
  return (
    <Container sx={contentContainer}>
      {children}
    </Container>
  );
}

export default AppContentContainer;
