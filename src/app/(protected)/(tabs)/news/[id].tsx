import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

// Interface for the news article (same as in index.tsx)
interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  snippet: string;
  content: string;
  imageUrl?: string;
  categories: ("TUR" | "GLB" | "SH")[]; // Birden fazla kategori olabilir
}

const { width } = Dimensions.get("window");

export default function NewsDetail() {
  const router = useRouter();
  const { id, article } = useLocalSearchParams();

  // Parse the article from the URL params
  const newsArticle: NewsArticle = article
    ? JSON.parse(article as string)
    : null;

  // Handle sharing
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsArticle.title} - ${newsArticle.snippet}`,
        url: newsArticle.imageUrl, // Optional: You might want to share a web URL instead
      });
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };

  if (!newsArticle) {
    return (
      <View style={styles.container}>
        <Text>Haber bulunamadı.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Haber Detayı",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.primaryVariant,
          },
          headerTintColor: colors.onPrimary,
        }}
      />

      <ScrollView style={styles.container}>
        {newsArticle.imageUrl && (
          <Image
            source={{ uri: newsArticle.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{newsArticle.title}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.source}>{newsArticle.source}</Text>
            <Text style={styles.date}>{newsArticle.publishedAt}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
              <Ionicons
                name="bookmark-outline"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons
                name="share-social-outline"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.contentText}>{newsArticle.content}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  image: {
    width: width,
    height: width * 0.6,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  source: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
  },
  actionButton: {
    marginLeft: 20,
    padding: 5,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
