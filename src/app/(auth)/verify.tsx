import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function VerifyScreen() {
  const image = require("../../../assets/register.png");
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();

  const checkEmailVerification = async () => {
    setError(null);
    setIsChecking(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (user && user.email_confirmed_at) {
        router.replace("/onboarding");
      } else {
        setError(
          "E-postanızı henüz doğrulamamışsınız. Lütfen mail kutunuza dönüp bağlantıya tıklayın."
        );
      }
    } catch (err: any) {
      setError(err.message ?? "Onay durumu alınırken hata oluştu.");
    } finally {
      setIsChecking(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!userEmail) {
      setError("E-posta adresi bulunamadı.");
      return;
    }
    setError(null);
    setIsResending(true);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
        options: {
          emailRedirectTo: "https://example.com/welcome", //TODO: Update with your redirect URL
        },
      });

      if (resendError) {
        throw resendError;
      }

      Alert.alert(
        "Başarılı",
        "Doğrulama e-postası tekrar gönderildi. Gelen kutunuzu kontrol edin."
      );
    } catch (err: any) {
      setError(err.message ?? "E-posta yeniden gönderilirken hata oluştu.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={image}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>
            Kayıt sırasında kullandığınız e-posta adresine bir doğrulama maili
            gönderildi. Gelen kutunuzu kontrol edip, “Hesabınızı Doğrula”
            bağlantısına tıklayın.
            <Text style={styles.boldText}>
              {" "}
              Linki tıkladıktan sonra aşağıdaki düğmeyi kullanarak onay
              durumunuzu kontrol edin.
            </Text>
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.actionButton, isChecking && { opacity: 0.6 }]}
            onPress={checkEmailVerification}
            disabled={isChecking}
          >
            {isChecking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="mail-open-outline"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.actionButtonText}>
                  E-postamı Doğruladım
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkButton, isResending && { opacity: 0.6 }]}
            onPress={resendVerificationEmail}
            disabled={isResending}
          >
            {isResending ? (
              <ActivityIndicator color="#C1121F" />
            ) : (
              <Text style={styles.linkButtonText}>
                Doğrulama E-postasını Tekrar Gönder
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.secondaryButtonText}>
              Zaten Doğruladım / Giriş Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // background: {
  //   flex: 1,
  //   paddingTop: 80,
  //   paddingHorizontal: 24,
  // },
  // topContainer: {
  //   alignItems: "center",
  //   marginBottom: 40,
  // },
  // title: {
  //   fontSize: 28,
  //   color: "#fff",
  //   fontWeight: "bold",
  //   marginBottom: 20,
  //   textAlign: "center",
  // },
  // subtitle: {
  //   fontSize: 16,
  //   color: "#ffffffaa",
  //   textAlign: "center",
  // },
  // formContainer: {
  //   flex: 1,
  //   justifyContent: "space-between",
  // },
  // fieldsContainer: {
  //   marginTop: 150, // Elemanları aşağıya taşımak için margin eklendi
  // },
  // input: {
  //   width: "100%",
  //   backgroundColor: "#fff",
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   paddingVertical: 14,
  //   marginBottom: 4, // Eşit boşluk için arttırıldı
  // },
  // errorText: {
  //   color: "#f8f8ff",
  //   marginBottom: 15,
  // },
  // bottomContainer: {
  //   width: "100%",
  //   marginBottom: 60,
  // },
  // submitButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "rgba(211,47,47,0.9)",
  //   borderWidth: 1,
  //   borderColor: "#fff",
  //   paddingVertical: 12,
  //   paddingHorizontal: 24,
  //   borderRadius: 30,
  //   marginBottom: 12,
  //   marginTop: 20,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 3,
  //   elevation: 4,
  // },
  // secondaryButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "rgba(0,0,0,0.9)",
  //   borderWidth: 1,
  //   borderColor: "#fff",
  //   paddingVertical: 12,
  //   paddingHorizontal: 24,
  //   borderRadius: 30,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 3,
  //   elevation: 4,
  // },
  // submitButtonText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginLeft: 8,
  // },
  // icon: {
  //   marginRight: 6,
  // },
  // error: {
  //   color: "#f8f8ff",
  //   marginBottom: 8,
  // },
  // instructionText: {
  //   color: "#F5F5F5",
  //   fontSize: 16,
  //   textAlign: "center",
  //   marginBottom: 35,
  // },
  background: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
  },
  instructionText: {
    color: "#F5F5F5",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: "600",
  },
  errorText: {
    color: "#ff5555",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C1121F",
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  icon: {
    marginRight: 6,
  },
  linkButton: {
    alignItems: "center",
    marginVertical: 12,
  },
  linkButtonText: {
    color: "#C1121F",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
