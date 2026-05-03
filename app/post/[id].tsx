import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { C } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Post = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  hashtags: string[];
  users: { nickname: string };
};

// useLocalSearchParamsでURLからidパラメータを付け取り、変数idに代入
export default function PostDatailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [nickname, setNickname] = useState("");

  // useEffectでもしidに値がある場合、DBから情報を持ってくるcecheAllファンクションを呼ぶ。このuseEffectはidが変化したら発火する
  useEffect(() => {
    if (id) fecheAll();
  }, [id]);
  // supabaseのauthからdataにuser情報を分割代入し、idをset
  // userがある場合その値をuidに。ない場合はnullを代入
  //
  async function fecheAll() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const uid = user?.id ?? null;
    setCurrentUserId(uid);

    // supabaseのpostテーブルからカードのidと一致する人のカラムを取得。usersが
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("id, created_at, hashtags, title, body, users(nickname)")
      .eq("id", id)
      .single();

    // もし取得に成功した場合、データをpに格納して、postに代入。かつそれぞれの変数に代入。
    if (!postError && postData) {
      const p = postData as any;
      setPost(p);
      // setTitle(p.title);
      // setBody(p.body);
      // setNickname(p.nickname);
    }
  }
  // postがnullの場合returnする。
  if (!post) return;

  function formatDate(d: string) {
    const dt = new Date(d);
    return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
  }

  const safeArea = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: safeArea.top}]}>
      <View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.nickname}>{post.users?.nickname}</Text>
          <Text style={styles.date}>{formatDate(post.created_at)}</Text>
        </View>
      </View>
      <View style={styles.diaryCard}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.body}</Text>
      </View>

      {post.hashtags?.length > 0 && (
        <View style={styles.hashtagRow}>
          {post.hashtags.map(tag => <Text style={styles.hashtag}>#{tag}</Text>)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  nickname: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  date: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  title: { fontSize: 20, fontWeight: "bold", color: C.textPrimary, marginBottom: 16 },
  body: { fontSize: 15, color: C.textSecondary, lineHeight: 26, backgroundColor: C.cardBg, padding: 16, borderRadius: 12 },
  diaryCard: { marginBottom: 12 } as any,
  hashtag: { fontSize: 13, color: C.accentDark, marginRight: 8, marginBottom: 4 },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },

});
