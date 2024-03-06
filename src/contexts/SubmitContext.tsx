import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface SubmitContextType {
  submit: () => void;
  setSubmit: (fn: () => void) => void;
  formChanged: boolean;
  setFormChanged: (changed: boolean) => void;
  formValid: boolean;
  setFormValid: (valid: boolean) => void;
}

interface SubmitProviderProps {
  children: ReactNode;
}

export const SubmitContext = createContext<SubmitContextType | undefined>(undefined);

export const useRegisterSubmit = () => {
  const context = useContext(SubmitContext);
  if (!context) throw new Error('useRegisterSubmit must be used within a SubmitProvider');
  return context.setSubmit;
}

export const useSubmit = () => {
  const context = useContext(SubmitContext);
  if (!context) throw new Error('useSubmit must be used within a SubmitProvider');
  return context.submit;
}

export const SubmitProvider: React.FC<SubmitProviderProps> = ({ children }) => {
  const [submit, setSubmitInternal] = useState<() => void>(() => () => {});
  const [formChanged, setFormChanged] = useState(false);
  const [formValid, setFormValid] = useState(false);
  
  // Wrap setSubmitInternal to ensure components cannot overwrite it directly.
  const setSubmit = useCallback((fn: () => void) => {
    setSubmitInternal(() => fn);
  }, []);

  // console.log(formChanged);
  // console.log(formValid);
  

  return (
    <SubmitContext.Provider value={{ submit, setSubmit, formChanged, setFormChanged, formValid, setFormValid }}>
      {children}
    </SubmitContext.Provider>
  );
};
