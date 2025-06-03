import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="news"
        options={{
          // tabBarBadge: unreadNewsCount > 0 ? unreadNewsCount : undefined,
          // tabBarBadgeStyle: { backgroundColor: colors.primaryVariant },
          title: "EarthQuake News",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="alarm"
        options={{
          title: "Vibration Alarm",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "EarthQuake List View",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
