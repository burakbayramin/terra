// app/(protected)/news/index.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";

// Supabase'deki sütun adlarına birebir denk gelecek şekilde tanımladık:
// DB'de "category" TEXT[] olarak tutuluyor.
interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string; // ISO veya timestamp string'i
  snippet: string;
  content: string;
  imageUrl?: string;
  category: ("TUR" | "GLB" | "SH")[]; // DB'deki array direkt bu alana gelir
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 24;

export default function News() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filter, setFilter] = useState<"TUR" | "GLB" | "SH">("SH");

  const fetchNews = async () => {
    setLoading(true);

    let query = supabase.from("news").select("*");

    if (filter !== "SH") {
      query = query.contains("category", [filter]);
    }

    const { data, error } = await query.order("published_at", {
      ascending: false,
    });

    if (error) {
      setArticles([]);
    } else if (data) {
      const mapped: NewsArticle[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        source: row.source,
        publishedAt: new Date(row.published_at).toLocaleString(),
        snippet: row.snippet,
        content: row.content,
        imageUrl: row.image_url,
        category: row.category as ("TUR" | "GLB" | "SH")[],
      }));
      setArticles(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [filter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ——— SEGMENTED BUTON GRUBU ——— */}
      <View style={styles.segmentContainer}>
        {(["SH", "TUR", "GLB"] as const).map((key) => {
          const label =
            key === "TUR"
              ? "Türkiye"
              : key === "GLB"
              ? "Global"
              : "Son Haberler";
          const isActive = filter === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.segmentButton,
                isActive && styles.segmentButtonActive,
              ]}
              onPress={() => setFilter(key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentText,
                  isActive && styles.segmentTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ——— LOADING DURUMU ——— */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Yükleniyor...</Text>
        </View>
      ) : (
        /* ——— HABER LİSTESİ ——— */
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/news/[id]",
                  params: {
                    id: item.id,
                    article: JSON.stringify(item),
                  },
                })
              }
            >
              <View style={styles.card}>
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>
                    {item.source} · {item.publishedAt}
                  </Text>
                  <Text style={styles.snippet}>{item.snippet}</Text>
                  <View style={styles.actions}>
                    <View style={styles.rightActions}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          // Bookmark işlemi
                        }}
                      >
                        <Ionicons name="bookmark-outline" size={20} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          // Paylaşma işlemi
                        }}
                      >
                        <Ionicons name="share-social-outline" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  segmentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#EEE",
    marginHorizontal: 4,
  },
  segmentButtonActive: {
    backgroundColor: colors.primaryVariant,
  },
  segmentText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  segmentTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  meta: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  snippet: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rightActions: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
});
