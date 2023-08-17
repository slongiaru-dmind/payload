import { useContext, createContext } from 'react';

export const EditDepthContext = createContext(0);

export const useEditDepth = (): number | undefined => useContext(EditDepthContext);
