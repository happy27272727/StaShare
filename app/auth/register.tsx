import {
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { C } from "@/constants/Colors";
import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function callRegister() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const makeemail = Math.random().toString(36).substring(2, 8);
  const email = `${makeemail}@example.com`;

  async function handleRegister() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      password,
      email,
    });

    if (error) {
      setLoading(false);
      window.alert("登録エラー" + error.message);
      return;
    }

    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        nickname,
        email
      });
      if (insertError) window.alert("insertエラー" + insertError.message);
    }
    setLoading(false);
  }

  const safeArea = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={[styles.container, safeArea]}>
      <Text style={styles.title}>アカウント作成</Text>
      <TextInput
        style={styles.input}
        placeholder="ニックネーム"
        placeholderTextColor={C.textMuted}
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        placeholderTextColor={C.textMuted}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{loading ? "登録中..." : "登録する"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>ログインに戻る</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  input: {
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: C.textPrimary,
    marginBottom: 12,
  },
  linkText: { color: C.accent, fontSize: 14},
  title: { fontSize: 24, fontWeight: 'bold', color: C.textPrimary, marginBottom: 23},
  buttonText: { fontSize: 16, color: C.white, fontWeight: 'bold'},
  button: { backgroundColor: C.headerBrown, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 16 },
});
