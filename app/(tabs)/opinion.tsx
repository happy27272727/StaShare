import { C } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function OpinionScreen() {
  const [opinion, setOpinion] = useState("");
  const [loading, setLoading] = useState(false);

  // 未入力ならアラートしてリターン
  // ユーザ名、コメント、日付をsupabaseにinsertするクエリを定義
  // もし成功なら’あざます’、失敗なら’失敗+error’

  async function handlePress(o: string) {
    if (!o) {window.alert('コメントを入力'); return;}
    setLoading(true);
    
    const { data: {user}, } = await supabase.auth.getUser();
    if (!user) {setLoading(false); return;}

const query = await supabase
.from('users')
.select('nickname')
.eq('id', user.id)
.single()

const { data: userData, error: nicknameerror} = query;
if (nicknameerror) {window.alert(nicknameerror.message); setLoading(false); return;}

const {error} = await supabase
    .from('comments')
    .insert({nickname: userData.nickname, comment: opinion.trim()});
    if (!error) {
      window.alert('あざます');
    } else {
        window.alert('失敗' + error);
      }
    setLoading(false);
    setOpinion('');
    }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>コメント</Text>
      </View>
      <View>
        <TextInput
        style={styles.opinioniInput}
        placeholder="意見や要望"
        placeholderTextColor={C.textMuted}
        value={opinion}
        onChangeText={setOpinion}
        multiline
        textAlignVertical='top'
        maxLength={500}
        >
        </TextInput>
        <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress(opinion)}
        disabled={loading}
        >
          <Text style={styles.buttonText}>送信</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background},
  header: { fontSize: 18, color: C.white, marginBottom: 10,},
  buttonText: { color: C.accent},
  opinioniInput: { backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.border, color: C.textPrimary, paddingHorizontal: 14, paddingVertical: 30, fontSize: 16, marginBottom: 10},
  button: { backgroundColor: C.headerBrown, borderRadius: 12, paddingVertical: 16, alignItems: 'center'},
})
