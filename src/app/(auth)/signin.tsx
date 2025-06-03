import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AppState,
} from "react-native";
import { z } from "zod";
import { supabase } from "../../lib/supabase";

const signInSchema = z.object({
  email: z.string({ message: "E-posta gereklidir" }).email("Geçersiz e-posta"),
  password: z
    .string({ message: "Şifre gerekli" })
    .min(8, "Şifre en az 8 karakter uzunluğunda olmalıdır"),
});
type SignInFields = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const image = require("../../assets/images/background.png");
  const image = require("../../../assets/background.png");
  const [sheetVisible, setSheetVisible] = useState(false);
  const openSheet = () => setSheetVisible(true);
  const closeSheet = () => setSheetVisible(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const signInWithEmail = async (data: SignInFields) => {
    try {
      const { error: supaError, data: supaData } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (supaError) {
        setError("root", { message: supaError.message });
      } else if (supaData.session) {
        closeSheet();
      } else {
        setError("root", {
          message: "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.",
        });
      }
    } catch (err) {
      setError("root", { message: "Beklenmeyen bir hata oluştu." });
    }
  };

  return (
    <ImageBackground
      source={image}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.topContainer}>
        <Text style={styles.title}>Terra</Text>
        <Text style={styles.subtitle}>Birlikte Güvendeyiz.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonWhite}>
          <Ionicons
            name="logo-google"
            size={20}
            color="#000"
            style={styles.icon}
          />
          <Text style={styles.buttonTextDark}>Google ile Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDark}>
          <Ionicons
            name="logo-apple"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonTextLight}>Apple ile Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRed} onPress={openSheet}>
          <Ionicons name="mail" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonTextLight}>E-posta ile Devam Et</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerText}>
        <Text style={styles.footerLabel}>Hesabın yok mu? </Text>
        <Link href="/register">
          <Text style={styles.footerLinkText}>Kayıt ol</Text>
        </Link>
      </View>

      <Modal
        visible={sheetVisible}
        animationType="slide"
        transparent
        onRequestClose={closeSheet}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.bottomSheet}>
                  <Text style={styles.sheetTitle}>E-posta ile Giriş Yap</Text>

                  <Controller
                    control={control}
                    name="email"
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState: { error },
                    }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="E-posta adresiniz"
                          placeholderTextColor="#888"
                          keyboardType="email-address"
                          autoComplete="email"
                          autoCapitalize="none"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                        {error && (
                          <Text style={styles.errorField}>{error.message}</Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState: { error },
                    }) => (
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Şifreniz"
                          placeholderTextColor="#888"
                          secureTextEntry
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                        {error && (
                          <Text style={styles.errorField}>{error.message}</Text>
                        )}
                      </View>
                    )}
                  />

                  {errors.root && (
                    <Text style={styles.errorRoot}>{errors.root.message}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleSubmit(signInWithEmail)}
                  >
                    <Text style={styles.sheetButtonText}>Giriş Yap</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  topContainer: {
    marginTop: "90%",
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffffaa",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  buttonWhite: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 12,
    elevation: 4,
  },
  buttonDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17,17,17,0.9)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 12,
    elevation: 4,
  },
  buttonRed: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(211,47,47,0.9)",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
  },
  buttonTextLight: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonTextDark: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  icon: {
    marginRight: 6,
  },
  footerText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  footerLabel: {
    color: "#fff",
    fontSize: 14,
  },
  footerLinkText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorField: {
    color: "crimson",
    marginTop: 4,
  },
  errorRoot: {
    color: "crimson",
    marginBottom: 12,
  },
  sheetButton: {
    backgroundColor: "#D43F30",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  sheetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
