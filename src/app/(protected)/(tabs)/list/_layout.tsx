import { Stack } from "expo-router";
import colors from "@/constants/colors";

export default function ListLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Son Depremler",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.primaryVariant,
          },
          headerTintColor: colors.onPrimary,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Deprem Detayı",
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
