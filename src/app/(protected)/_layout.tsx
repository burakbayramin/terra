import { useAuth } from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <Stack.Screen name="/signin" options={{ headerShown: false }} />;
  // }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
