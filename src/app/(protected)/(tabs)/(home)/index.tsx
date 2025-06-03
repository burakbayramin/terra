import React from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";
import { supabase } from "../../../../lib/supabase";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = width * 0.50;


const AFAD_DATA = [
  {
    id: "1",
    datetime: "18 May 2025, 20:01",
    regionTag: "Aegean",
    title: "MIDILLI ADASI (EGE DENİZİ)",
    depth: 9.5,
    magnitude: 2.3,
    coords: { latitude: 39.0, longitude: 26.0 },
  },
  {
    id: "2",
    datetime: "18 May 2025, 20:03",
    regionTag: "Aegean",
    title: "KARABURUN (İZMİR)",
    depth: 7.8,
    magnitude: 1.9,
    coords: { latitude: 38.6, longitude: 26.1 },
  },
  // ... (devamı)
];

const KANDILLI_DATA = [
  {
    id: "10",
    datetime: "18 May 2025, 19:50",
    regionTag: "Marmara",
    title: "MARMARA DENİZİ (TEKİRDAĞ)",
    depth: 7.2,
    magnitude: 1.7,
    coords: { latitude: 40.8, longitude: 27.0 },
  },
  {
    id: "11",
    datetime: "18 May 2025, 19:55",
    regionTag: "Aegean",
    title: "ÇEŞME (İZMİR)",
    depth: 5.2,
    magnitude: 2.1,
    coords: { latitude: 38.3, longitude: 26.3 },
  },
  // ... (devamı)
];

const ULUSLARARASI_DATA = [
  {
    id: "20",
    datetime: "18 May 2025, 21:00 UTC",
    regionTag: "Pacific Rim",
    title: "JUNEAU (ALASKA, USA)",
    depth: 10.0,
    magnitude: 4.0,
    coords: { latitude: 58.3, longitude: -134.4 },
  },
  {
    id: "21",
    datetime: "18 May 2025, 20:45 UTC",
    regionTag: "Pacific Rim",
    title: "SOUTH OF FOZEN ISLAND (JAPAN)",
    depth: 30.0,
    magnitude: 5.2,
    coords: { latitude: 33.1, longitude: 135.7 },
  },
  // ... (devamı)
];

// ——— SAMPLE ALARMS ———
const ALARMS = [
  {
    id: "1",
    start: "20:00",
    end: "06:00",
    days: ["M", "T", "W", "T", "F", "S", "S"],
    enabled: true,
  },
  {
    id: "2",
    start: "22:30",
    end: "07:00",
    days: ["M", "T", "W", "T", "F"],
    enabled: false,
  },
  {
    id: "3",
    start: "18:15",
    end: "23:45",
    days: ["S", "S"],
    enabled: false,
  },
];

type FilterType = "afad" | "kandilli" | "uluslararasi";

export default function Home() {
  const router = useRouter();
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  // Hangi butonun seçili olduğunu tutacak state
  const [filter, setFilter] = React.useState<FilterType>("afad");

  // Seçilen filtreye göre hangi veriyi göstereceğimizi belirleyen fonksiyon
  const getDataByFilter = (): typeof AFAD_DATA => {
    switch (filter) {
      case "afad":
        return AFAD_DATA;
      case "kandilli":
        return KANDILLI_DATA;
      case "uluslararasi":
        return ULUSLARARASI_DATA;
      default:
        return AFAD_DATA;
    }
  };

  // Anlık filtrelenmiş data
  const carouselData = getDataByFilter();

  return (
    <View style={styles.container}>
      {/* ——— SEGMENTED BUTTON GROUP ——— */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            filter === "afad" && styles.segmentButtonActive,
          ]}
          onPress={() => setFilter("afad")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              filter === "afad" && styles.segmentTextActive,
            ]}
          >
            AFAD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            filter === "kandilli" && styles.segmentButtonActive,
          ]}
          onPress={() => setFilter("kandilli")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              filter === "kandilli" && styles.segmentTextActive,
            ]}
          >
            Kandilli
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            filter === "uluslararasi" && styles.segmentButtonActive,
          ]}
          onPress={() => setFilter("uluslararasi")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              filter === "uluslararasi" && styles.segmentTextActive,
            ]}
          >
            Uluslararası
          </Text>
        </TouchableOpacity>
      </View>

      {/* ——— EARTHQUAKE CAROUSEL ——— */}
      <View style={styles.carouselWrapper}>
        <Carousel
          loop
          autoPlay
          width={width}
          height={CARD_HEIGHT + 140}
          data={carouselData}
          ref={carouselRef}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.mapContainer}>
                <MapView
                  style={StyleSheet.absoluteFill}
                  initialRegion={{
                    ...item.coords,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                  }}
                  pointerEvents="none"
                >
                  <Marker coordinate={item.coords} />
                  <Circle
                    center={item.coords}
                    radius={20000}
                    fillColor="rgba(255,0,0,0.2)"
                    strokeColor="rgba(255,0,0,0.5)"
                  />
                </MapView>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.magnitude}</Text>
                </View>
              </View>

              <View style={styles.info}>
                <View style={styles.row}>
                  <Text style={styles.date}>{item.datetime}</Text>
                  <View style={styles.regionTag}>
                    <Text style={styles.regionTagText}>{item.regionTag}</Text>
                  </View>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.depth}>Depth: {item.depth} km</Text>
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Detayları Göster</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <Pagination.Basic
          progress={progress}
          data={carouselData}
          size={5}
          containerStyle={styles.pagination}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          onPress={(i) =>
            carouselRef.current?.scrollTo({
              count: i - progress.value,
              animated: true,
            })
          }
        />
      </View>

      {/* ——— ALARMS LIST ——— */}
      <View style={styles.alarmsContainer}>
        <FlatList
          data={[...ALARMS, { id: "add" }]}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => {
            if (item.id === "add") {
              return (
                <TouchableOpacity
                  style={[styles.alarmCard, styles.addCard]}
                  activeOpacity={0.7}
                  onPress={() => router.push("/new-alarm")}
                >
                  <Text style={styles.addText}>＋</Text>
                </TouchableOpacity>
              );
            }

            return (
              <View style={styles.alarmCard}>
                <View style={styles.alarmRow}>
                  <Text
                    style={[
                      styles.alarmTime,
                      !item.enabled && styles.alarmDisabled,
                    ]}
                  >
                    {item.start} – {item.end}
                  </Text>
                  <Switch
                    value={item.enabled}
                    onValueChange={(val) => {
                      /* TODO: toggle state işlemini burada yap */
                    }}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 10, // Header ile everything arasındaki boşluk
  },

  // ——— SEGMENTED CONTROL STYLES ———
  segmentContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.primaryVariant,
    marginBottom: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonActive: {
    backgroundColor: colors.primaryVariant,
  },
  segmentText: {
    fontSize: 14,
    color: colors.primaryVariant, // örn. gri ton
    fontWeight: "500",
  },
  segmentTextActive: {
    color: colors.onPrimary, // beyaz gibi
  },

  // ——— CAROUSEL STYLES ———
  carouselWrapper: {
    marginTop: 0, // segment kontrol zaten boşluk ekledi
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  mapContainer: {
    height: CARD_HEIGHT,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontWeight: "bold" },

  info: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 12, color: "#777" },
  regionTag: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  regionTagText: { fontSize: 10, color: "#333" },

  title: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  depth: {
    marginTop: 2,
    fontSize: 12,
    color: "#555",
  },
  button: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: colors.primaryVariant,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: colors.onPrimary, fontWeight: "500" },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  activeDot: {
    backgroundColor: colors.primaryVariant,
  },

  // ——— ALARMS STYLES ———
  alarmsContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  alarmCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 2, // Android shadow
    borderWidth: 0.1,
    borderColor: colors.primaryVariant,
  },
  alarmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  alarmDisabled: {
    color: "#bbb",
  },
  addCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 32,
    fontWeight: "300",
    color: colors.primaryVariant,
  },
});
