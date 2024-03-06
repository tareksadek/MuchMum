import { createContext, useContext } from "react";

type WizardContextType = {
  currentStep: number;
  profileData: any;
  setProfileData: (data: any) => void;
  nextStep: () => void;
};

export const ProfileWizardContext = createContext<WizardContextType | undefined>(undefined);

export const useProfileWizard = () => {
  const context = useContext(ProfileWizardContext);
  if (!context) {
    throw new Error("useProfileWizard must be used within ProfileWizardProvider");
  }
  return context;
};

// export const ProfileWizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [profileData, setProfileData] = useState({});

//   const nextStep = () => setCurrentStep((prev) => prev + 1);

//   return (
//     <ProfileWizardContext.Provider value={{ currentStep, profileData, setProfileData, nextStep }}>
//       {children}
//     </ProfileWizardContext.Provider>
//   );
// };
