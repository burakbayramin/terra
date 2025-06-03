import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Earthquake } from "@/types/types";
import colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";

export default function List() {
  const router = useRouter();
  const [earthquakes, setEathquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEarthquakes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("earthquake")
      .select("*")
      .order("date", { ascending: false })
      .limit(20);

    if (error) {
      setEathquakes([]);
    } else if (data) {
      const mapped: Earthquake[] = data.map((row: any) => ({
        id: row.id,
        earthquake_id: row.earthquake_id,
        provider: row.provider,
        title: row.title,
        date: row.date,
        mag: row.mag,
        depth: row.depth,
        coordinates: row.coordinates,
        location_tz: row.location_tz,
      }));
      setEathquakes(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEarthquakes();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude < 4) return "#4CAF50"; // Green for low magnitude
    if (magnitude < 5) return "#FFC107"; // Yellow for medium magnitude
    if (magnitude < 6) return "#FF9800"; // Orange for high magnitude
    return "#F44336"; // Red for very high magnitude
  };
  const renderItem = ({ item }: { item: Earthquake }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item && item.earthquake_id) {
          router.push(`/list/${item.earthquake_id}`);
        }
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.magnitudeContainer,
              { backgroundColor: getMagnitudeColor(item.mag) },
            ]}
          >
            <Text style={styles.magnitude}>{item.mag.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.depth}>Derinlik: {item.depth} km</Text>
            <Text style={styles.provider}>{item.provider}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={earthquakes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Deprem verisi bulunamadı.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    marginRight: 16,
  },
  rightSection: {
    flex: 1,
  },
  magnitudeContainer: {
    borderRadius: 10,
    padding: 8,
    minWidth: 54,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  magnitude: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    alignItems: "center",
  },
  date: {
    color: "#666",
    fontSize: 13,
    marginBottom: 3,
  },
  depth: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  provider: {
    fontSize: 11,
    color: "#888",
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
