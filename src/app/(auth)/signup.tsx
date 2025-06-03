import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ImageBackground,
  Keyboard,
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

const signUpSchema = z
  .object({
    email: z
      .string({ message: "E-posta gereklidir" })
      .email("Geçersiz e-posta"),
    password: z
      .string({ message: "Şifre gerekli" })
      .min(8, "Şifre en az 8 karakter uzunluğunda olmalıdır"),
    confirmPassword: z.string({ message: "Şifre tekrar gerekli" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type SignUpFields = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const image = require("../../../assets/register.png");
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpWithEmail = async (data: SignUpFields) => {
    try {
      const {
        data: { user, session },
        error: supaError,
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (supaError) {
        setError("root", { message: supaError.message });
      } else {
        if (!session) {
          router.replace({
            pathname: "/verify",
            params: { userEmail: data.email },
          });
        }
      }
    } catch (err) {
      setError("root", { message: "Beklenmeyen bir hata oluştu." });
      console.error(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={image}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.topContainer}>
          <Text style={styles.title}>Terra</Text>
          <Text style={styles.subtitle}>
            Terra’ya kaydolmak için e-posta adresinizi ve güvenli bir şifreyi
            doldurun. Bu bilgiler, acil durum bildirimlerinizi korur.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldsContainer}>
            <Controller
              control={control}
              name="email"
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="E-posta adresiniz"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                  />
                  <Text style={styles.error}>{error?.message}</Text>
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
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Şifreniz"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                  />
                  <Text style={styles.error}>{error?.message}</Text>
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Şifre (Tekrar)"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                  />
                  <Text style={styles.error}>{error?.message}</Text>
                </View>
              )}
            />

            {errors.root && (
              <Text style={styles.error}>{errors.root.message}</Text>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(signUpWithEmail)}
            >
              <Ionicons
                name="mail"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.submitButtonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.submitButtonText}>
                Zaten bir hesabın var mı?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  topContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffffaa",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  fieldsContainer: {},
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 4, // Eşit boşluk için arttırıldı
  },
  errorText: {
    color: "#f8f8ff",
    marginBottom: 8,
  },
  bottomContainer: {
    width: "100%",
    marginBottom: 60,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(211,47,47,0.9)",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  icon: {
    marginRight: 6,
  },
  error: {
    color: "#f8f8ff",
    marginBottom: 8,
  },
});
