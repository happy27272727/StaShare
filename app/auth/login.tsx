import {
  Text,
  TextInput,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/constants/Colors";

export default function loginScreen() {
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  let email = null;

  async function handlelogin() {
    if (!nickname || !password) {
      window.alert("ニックネームとパスワードを入力");
      return;
    }
    setLoading(true);
    let query = supabase.from("users").select("email").eq("nickname", nickname);
    const { data, error: fetchError } = await query.single();
    if (!data || fetchError) {
      window.alert("失敗");
      return;
    }
    email = data?.email;
    console.log('signIn 開始', email); 
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('signIn 完了', error); 
    setLoading(false);
    if (error) {
      window.alert("ログインエラー:" + error.message);
    }
  }

  const safeArea = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={[styles.container, safeArea]}>
      <Text style={styles.logo}>StaShare</Text>
      <Text style={styles.subtitle}>その気づき、シェアしよう</Text>
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
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlelogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>
      <Link href="/auth/register" asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>アカウントをお持ちでない方</Text>
        </TouchableOpacity>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    fontSize: 16,
    color: C.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
buttonText: { color: C.white, fontSize: 16, fontWeight: 'bold' },
logo: { fontSize: 42, textAlign: 'center', marginBottom: 8, color: C.accent, fontFamily: 'pacifico'},
subtitle: { fontSize: 14, color: C.textMuted, textAlign: 'center', marginBottom: 40},
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  button: {
    backgroundColor: C.headerBrown,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  linkText: {
    color: C.accent,
  },
});
