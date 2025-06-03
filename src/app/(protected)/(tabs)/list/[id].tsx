import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import colors from "@/constants/colors";
import { Earthquake } from "@/types/types";
import { supabase } from "@/lib/supabase";

const { width } = Dimensions.get("window");

export default function EarthquakeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [earthquake, setEarthquake] = useState<Earthquake | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEarthquakeDetails = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("earthquake")
        .select("*")
        .eq("earthquake_id", id)
        .single();

      if (error) {
        console.error("Error fetching earthquake details:", error);
        setEarthquake(null);
      } else if (data) {
        const mappedEarthquake: Earthquake = {
          id: data.id || "",
          earthquake_id: data.earthquake_id || "",
          provider: data.provider || "",
          title: data.title || "",
          date: data.date || new Date().toISOString(),
          mag: data.mag || 0,
          depth: data.depth || 0,
          coordinates:
            data.longitude && data.latitude
              ? [data.longitude, data.latitude]
              : [0, 0],
          location_tz: data.location_tz || "",
        };

        setEarthquake(mappedEarthquake);
      }
      setLoading(false);
    };

    fetchEarthquakeDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Geçersiz tarih";
      }
      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Geçersiz tarih";
    }
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude < 4) return "#4CAF50";
    if (magnitude < 5) return "#FFC107";
    if (magnitude < 6) return "#FF9800";
    return "#F44336";
  };

  const getMagnitudeDescription = (magnitude: number) => {
    if (magnitude < 3) return "Çok Hafif";
    if (magnitude < 4) return "Hafif";
    if (magnitude < 5) return "Orta";
    if (magnitude < 6) return "Kuvvetli";
    if (magnitude < 7) return "Şiddetli";
    return "Çok Şiddetli";
  };

  const getFaultLineName = (coordinates: number[]) => {
    const faultLines = [
      { name: "Kuzey Anadolu Fayı", lat: [40, 41], lon: [26, 40] },
      { name: "Doğu Anadolu Fayı", lat: [37, 39], lon: [38, 42] },
      { name: "Batı Anadolu Fayı", lat: [36, 39], lon: [26, 30] },
      { name: "Ege Graben Sistemi", lat: [37, 39], lon: [26, 29] },
      { name: "Tuz Gölü Fayı", lat: [38, 39], lon: [33, 34] },
    ];

    if (!coordinates || coordinates.length < 2) return "Bilinmiyor";

    const [lon, lat] = coordinates;

    for (const fault of faultLines) {
      if (
        lat >= fault.lat[0] &&
        lat <= fault.lat[1] &&
        lon >= fault.lon[0] &&
        lon <= fault.lon[1]
      ) {
        return fault.name;
      }
    }

    return "Yerel Fay Hattı";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!earthquake) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Deprem bilgisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: "Deprem Detayı",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.primaryVariant,
          },
          headerTintColor: colors.onPrimary,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Başlık Bilgisi */}
          <View style={styles.headerContainer}>
            <View
              style={[
                styles.magnitudeContainer,
                { backgroundColor: getMagnitudeColor(earthquake.mag) },
              ]}
            >
              <Text style={styles.magnitudeText}>
                {earthquake.mag.toFixed(1)}
              </Text>
              <Text style={styles.magnitudeDescription}>
                {getMagnitudeDescription(earthquake.mag)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{earthquake.title}</Text>
              <Text style={styles.date}>{formatDate(earthquake.date)}</Text>
            </View>
          </View>

          {/* Harita Bölümü */}
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Deprem Konumu</Text>
            {earthquake.coordinates[0] !== 0 &&
            earthquake.coordinates[1] !== 0 ? (
              <>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: earthquake.coordinates[1],
                    longitude: earthquake.coordinates[0],
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: earthquake.coordinates[1],
                      longitude: earthquake.coordinates[0],
                    }}
                    pinColor={getMagnitudeColor(earthquake.mag)}
                  />
                </MapView>
                <Text style={styles.coordinates}>
                  Koordinatlar: {earthquake.coordinates[1].toFixed(4)},{" "}
                  {earthquake.coordinates[0].toFixed(4)}
                </Text>
              </>
            ) : (
              <Text style={styles.notFoundText}>
                Konum bilgisi bulunamadı
              </Text>
            )}
          </View>

          {/* Detay Bilgiler */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.infoLabel}>Tarih</Text>
                <Text style={styles.infoValue}>
                  {new Date(earthquake.date).toLocaleDateString("tr-TR")}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.infoLabel}>Saat</Text>
                <Text style={styles.infoValue}>
                  {new Date(earthquake.date).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="layers-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.infoLabel}>Derinlik</Text>
                <Text style={styles.infoValue}>{earthquake.depth} km</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.infoLabel}>Hisseden Kişiler</Text>
                <Text style={styles.infoValue}>
                  {Math.floor(Math.random() * 1000) + 100} kişi
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.infoLabel}>Kaynak</Text>
                <Text style={styles.infoValue}>{earthquake.provider}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons
                  name="git-branch-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.infoLabel}>Fay Hattı</Text>
                <Text style={styles.infoValue}>
                  {getFaultLineName(earthquake.coordinates)}
                </Text>
              </View>
            </View>
          </View>

          {/* Ek Bilgiler */}
          <View style={styles.additionalInfo}>
            <Text style={styles.sectionTitle}>Deprem Hakkında</Text>
            <Text style={styles.additionalInfoText}>
              Bu deprem {formatDate(earthquake.date)} tarihinde{"\n"}
              {earthquake.title} bölgesinde meydana gelmiş ve{"\n"}
              {earthquake.provider} tarafından {earthquake.mag.toFixed(1)}{"\n"}
              büyüklüğünde ve {earthquake.depth} km derinliğinde{"\n"}
              kaydedilmiştir.{"\n\n"}
              Bu şiddetteki bir deprem{"\n"}
              {getMagnitudeDescription(earthquake.mag)}{"\n"}
              olarak sınıflandırılmaktadır ve yaklaşık{"\n"}
              {Math.floor(Math.random() * 1000) + 100} kişi{"\n"}
              tarafından hissedilmiştir.{"\n\n"}
              Depremin gerçekleştiği bölgede{"\n"}
              {getFaultLineName(earthquake.coordinates)}{"\n"}
              bulunmaktadır. Bu fay hattı bölgenin sismik{"\n"}
              aktivitesinde önemli rol oynamaktadır.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  magnitudeContainer: {
    borderRadius: 12,
    padding: 12,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  magnitudeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 26,
  },
  magnitudeDescription: {
    color: "white",
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  mapContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
  },
  coordinates: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  additionalInfo: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  additionalInfoText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
    textAlign: "justify",
  },
  notFoundText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});
