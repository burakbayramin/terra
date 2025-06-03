import { Stack } from "expo-router";
import colors from "@/constants/colors";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Terra",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.primaryVariant,
          },
          headerTintColor: colors.onPrimary,
        }}
      />
    </Stack>
  );
}
