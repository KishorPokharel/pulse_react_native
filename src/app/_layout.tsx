import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";

function InnerLayout() {
  const { isAuthLoading, isLoggedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isAuthLoading}>
        <Stack.Screen name="apploader" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
}
