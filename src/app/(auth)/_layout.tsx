import { useAuth } from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Stack.Screen
        name="/(protected)/(tabs)/(home)"
        options={{ headerShown: false }}
      />
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="signin"
        options={{ headerShown: false, title: "Giriş Yap" }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false, title: "Kayıt ol" }}
      />
      <Stack.Screen
        name="verify"
        options={{ headerShown: false, title: "Doğrula" }}
      />
    </Stack>
  );
}
