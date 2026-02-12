import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";

function InnerLayout() {
  const { isAuthLoading, isLoggedIn } = useAuth();
  const { theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{ contentStyle: { backgroundColor: theme.background } }}
      >
        <Stack.Protected guard={isAuthLoading}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="user" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar barStyle="dark-content" />
    </>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <InnerLayout />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
