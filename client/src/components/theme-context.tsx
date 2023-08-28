import { ReactNode, createContext, useContext, useState } from 'react';

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  handleSetTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.Light,
  setTheme: (theme) => console.warn(`Theme is ${theme}`),
  handleSetTheme: () => console.warn('Theme is being set'),
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  const handleSetTheme = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  return <ThemeContext.Provider value={{ theme, setTheme, handleSetTheme }}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used inside the ThemeProvider');
  }

  return context;
};
