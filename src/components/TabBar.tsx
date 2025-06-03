// TabBar.tsx (parantez temizleyen versiyon)
import React, { JSX } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Foundation,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import colors from "@/constants/colors";

type IconKey = "news" | "alarm" | "home" | "list" | "profile";

const icons: Record<IconKey, (props: { color: string }) => JSX.Element> = {
  news: (props) => <Entypo name="news" size={24} {...props} />,
  alarm: (props) => (
    <MaterialCommunityIcons name="vibrate" size={24} {...props} />
  ),
  home: (props) => <Foundation name="home" size={24} {...props} />,
  list: (props) => <Foundation name="list" size={24} {...props} />,
  profile: (props) => <FontAwesome name="user" size={24} {...props} />,
};

const primaryColor = colors.primaryVariant;
const greyColor = "#737373";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // options.tabBarLabel veya options.title bir dizi veya fonksiyon dönebilir.
        // Biz burada kesinlikle bir string'e (plain string) zorlayacağız:
        const label: string =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
            ? options.title
            : route.name;

        // route.name parantez içeriyorsa kaldır:
        // Örneğin "(home)" => "home"
        const rawName = route.name.replace(/^\(|\)$/g, "");
        // “(home)” veya “home” => “home”
        if (!["news", "alarm", "home", "list", "profile"].includes(rawName)) {
          return null;
        }

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        // Parantezlerden temizlenmiş anahtar, IconKey ile uyumlu:
        const iconName = rawName as IconKey;
        const IconComponent = icons[iconName];
        if (!IconComponent) return null;

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
          >
            <IconComponent color={isFocused ? primaryColor : greyColor} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
