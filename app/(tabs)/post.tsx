import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { C } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";

const HASHTAG_SUGGESTIONS = [
  "JAVA",
  "SQL",
  "JS",
  "資格",
  "失敗",
  "遅延",
  "教訓",
  "メンタル",
  "その他",
];

export default function PostScreen() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // 引数tagをstringで受け取る
  // 変数hashtagにsetする。set前状態で値が含まれている（入っている）場合、filterで値とtagを比較する。一致しないものは配列を展開してtagを追加。
  function toggleHashtag(tag: string) {
    setHashtags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>記録</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="タイトル（例：ビルド・デプロイとは）"
        placeholderTextColor={C.textMuted}
        value={title}
        onChangeText={setTitle}
        maxLength={50}
      />
      <TextInput
        style={styles.bodyInput}
        placeholder="学びや体験談を書こう"
        placeholderTextColor={C.textMuted}
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.label}>ハッシュタグ（複数選択可）</Text>

      {/* 定数の配列に格納された値をmapを使って一個ずつ取り出してtagという引数に渡す。
      （）内のjsxを返す */}
      <View style={styles.chipRow}>
        {HASHTAG_SUGGESTIONS.map(tag => (
          <TouchableOpacity key={tag} style={[styles.chip, hashtags.includes(tag) && styles.chipSelected]} onPress={() => toggleHashtag(tag)}>
            <Text style={[styles.chipText, hashtags.includes(tag) && styles.chipTextSelected]}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={postKiroku}>
        <Text style={styles.kirokuBtnText}>記録する</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  async function postKiroku() {
    if (!title || !body) {
      window.alert('タイトルと内容入力しろよ')
      return;
    }
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from("posts")
      .insert({ user_id: user.id, title: title.trim(), body: body.trim(), hashtags: hashtags});
    if (error) {
      return;
    }
    setTitle("");
    setBody("");
    setHashtags([]);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: C.textPrimary,
    marginBottom: 16,
  },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: C.accent, backgroundColor: C.cardBg, marginRight: 8, marginBottom: 8},
  titleInput: {
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.border,
    color: C.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10
  },
  label: { fontSize: 14, fontWeight: '600', color: C.textPrimary, marginBottom: 8},
  chipText: { fontSize: 13, color: C.textSecondary },
  chipTextSelected: { color: C.textPrimary, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  chipSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  bodyInput: {
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.border,
    color: C.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    height: 200,
  },
  button: { backgroundColor: C.headerBrown, borderRadius: 12, paddingVertical: 16,
    alignItems: 'center'
  },
  kirokuBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
