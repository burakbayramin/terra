import { View, Text } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  return (
    <View>
      <Text
        onPress={() => {
          supabase.auth.signOut();
        }}
      >
        singout
      </Text>
    </View>
  );
}
