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

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
