import { Stack } from "expo-router";
import colors from "@/constants/colors";

export default function NewsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Haberler",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.primaryVariant,
          },
          headerTintColor: colors.onPrimary,
        }}
      />
      {/* Detail screen is configured in its own file */}
    </Stack>
  );
}
