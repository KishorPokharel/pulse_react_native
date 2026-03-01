import { createContext, PropsWithChildren, useContext } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { darkTheme, lightTheme, Theme } from "../constants/theme";

type ThemeContextType = {
  theme: Theme;
  colorScheme: ColorSchemeName;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
