import {
  Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
// import Avatar from '@/constants/Avatar';
import { Link, router, useFocusEffect } from "expo-router";
import { C } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Animated, {
//   // useAnimatedStyle,
//   useSharedValue,
// } from "react-native-reanimated";

type Post = {
  id: string;
  title: string;
  user_id: string;
  hashtags: string[];
  created_at: string;
  users: { nickname: string };
};

const POPULAR_TAGS = [
  "JAVA",
  "SQL",
  "JS",
  "失敗",
  "遅延",
  "教訓",
  "メンタル",
  "その他",
];
const HEADER_H = 44;
const TAGBAR_H = 54;
const TOTAL_H = HEADER_H + TAGBAR_H;


export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // const translateY = useSharedValue(0);

  async function fetchPost(tag?: string | null) {
    let query = supabase
      .from("posts")
      .select("id, hashtags, created_at, user_id, title, body, users(nickname)")
      .order('created_at', { ascending: false});
      if(tag) query = query.contains('hashtags', [tag]);
    const { data, error } = await query;
    if (!error && data) setPosts(data as any);
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPost(selectedTag).finally(() => setLoading(false));
    }, [selectedTag])
  );

  // async function onRefresh() {
  //   setRefreshing(true);
  //   await fetchPost(selectedTag);
  //   setRefreshing(false);
  // }

  function formatDate(d: string) {
    const dt = new Date(d)
    return `${dt.getMonth() + 1}/${dt.getDate()}`
  }

  // const headerStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateY: translateY.value }],
  // }));

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={posts.length === 0 ? [styles.emptyContainer, {
          paddingTop: TOTAL_H }] : { paddingTop: TOTAL_H + 8, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/post/${item.id}` as any)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.nickname}>{item.users?.nickname}</Text>
              <Text style={{ color: C.textMuted, fontSize: 12 }}>{formatDate(item.created_at)}</Text>
            </View>
            <View>
              <Text style={styles.cardtitle}>{item.title}</Text>
              <Text>{item.hashtags.map( tag => (
                <Text key={tag} style={styles.cardTagText}>#{tag}</ Text>
              ))}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* フローティングヘッダー */}
      <View style={[styles.floatingHeader, { top: insets.top}]}>
        <View style={styles.headerBar}>
          <Text style={styles.headerLogo}>StaShare</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagBar}
          contentContainerStyle={styles.tagBarContent}
        >
          <TouchableOpacity
           style={[styles.tagChip, !selectedTag && styles.tagChipSelected]}
           onPress={() => setSelectedTag(null)}>
            <Text style={[styles.tagText, !selectedTag && styles.tagTextSelected]}>すべて</Text>
          </TouchableOpacity>
          {POPULAR_TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagChip, selectedTag === tag && styles.tagChipSelected]}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              <Text style={[styles.tagText, selectedTag === tag && styles.tagTextSelected]}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  headerLogo: { fontSize: 22, color: C.accent, fontFamily: "Pacifico" },
  headerBar: {
    height: HEADER_H,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  nickname: { fontSize: 13, fontWeight: "600", color: C.textPrimary, flex: 1 },
  card: {
    backgroundColor: C.cardBg,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    boxShadow: "0 1px 4px rgba(0,0,0,0,07)",
  } as any,
  cardtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: C.textPrimary,
    marginBottom: 8,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: C.headerBrown,
    boxShadow: "0 1px 4px rgba(0,0,0,0/18)",
  } as any,
  tagBar: {
    height: TAGBAR_H,
    backgroundColor: C.tagBg,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  tagBarContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: C.cardBg, borderWidth: 1, borderColor: C.border, marginRight: 6 },
  tagChipSelected: { backgroundColor: C.tagSelected, borderColor: C.tagSelected },
  tagText: { fontSize: 12, color: C.accent,},
  cardTagText: { fontSize: 12, color: C.accent, marginRight: 5},
  tagTextSelected: { color: C.white, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
});
