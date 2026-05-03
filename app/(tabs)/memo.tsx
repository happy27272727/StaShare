import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { MEMO_CONTENT } from '@/constants/memoContent';
import { C } from '@/constants/Colors';

export default function MemoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Markdown style={{
        body: { color: C.textPrimary },
        fence: { backgroundColor: '#0D1117', borderColor: C.border },
        code_inline: { backgroundColor: '#0D1117', color: '#79C0FF' },
        code_block: { backgroundColor: '#0D1117', color: '#79C0FF' },
      }}>{MEMO_CONTENT}</Markdown>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    padding: 16,
  },
});
