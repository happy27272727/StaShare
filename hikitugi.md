● 引継ぎ

  StaShare（React Native / Expo Router）を tennis-note2
  を参考に自力で構築中。コードの答えは出さずヒントのみ。

  現状
  - app/_layout.tsx
    - unstable_settings で initialRouteName: '(tabs)' を設定
    - RootLayoutNav() でセッションチェック → replace の振り分けロジック実装済み
    - useEffect に [session, loading, segments] の依存配列あり
    - loading チェックを useEffect 内の先頭に追加済み
    - セッションなし → /auth/login へ、セッションあり → /(tabs)/ へ replace
  - app/auth/_layout.tsx - <Stack> に index / register / login の Stack.Screen を登録
  - app/auth/login.tsx - ログイン画面
    - nickname / password / loading の state あり
    - email は let で宣言し、fetch後に直接代入する形に修正済み（useState非同期問題を回避）
    - handlelogin() で users テーブルから nickname → email を取得
    - fetchError 時は return で早期脱出済み
    - 取得した email を signInWithPassword に渡す実装済み
    - window.alert(email) のデバッグ用アラートが残っている（動作確認後に削除予定）
  - app/auth/register.tsx - アカウント作成画面
    - nickname / password / loading の useState あり
    - email は Math.random().toString(36).substring(2,8) で自動生成（ひらがな対策）
    - handleRegister() で signUp → data.user から直接 id を取得
    - signUp 成功後に supabase.from('users').insert で id / nickname / email を登録
    - TouchableOpacity のネスト解消済み
  - app/(tabs)/_layout.tsx - <Tabs> を return。tabBarActiveTintColor 設定済み
  - app/(tabs)/index.tsx - ホーム画面
    - FlatList で posts を表示（keyExtractor={item => item.id} 設定済み）
    - useFocusEffect + useCallback で画面フォーカス時にデータ取得
    - selectedTag state でタグフィルタリング実装済み（.contains() 使用）
    - useEffect([selectedTag]) でタグ変化時に再フェッチ
    - select で users(nickname) を JOIN して投稿者名を取得
    - RLS の SELECT ポリシー設定済み（全員許可）
    - フローティングヘッダー + タグバー実装済み（position: absolute）
    - FlatList に contentContainerStyle={{ paddingTop: TOTAL_H }} でヘッダー分のスペース確保
  - app/(tabs)/post.tsx - 記録画面
    - posts テーブルへの INSERT 完了
    - posts テーブル：id は gen_random_uuid()、created_at は now() で自動生成
  - app/(tabs)/memo.tsx - memo.md の内容を Markdown 表示
  - constants/Colors.ts - カラー定数 C を定義済み
  - constants/memoContent.ts - memo.md の内容を文字列定数として管理
  - lib/supabase.ts - createClient で Supabase クライアント初期化済み
    - storageAdapter は undefined のまま（ブラウザは localStorage で代替動作中）
  - hooks/useSession.ts - セッション管理
    - getSession でローカルのセッションを確認して返す
    - onAuthStateChange の追加が未完了（VSCode再起動後に作業予定）
  - Supabase
    - 友人のアカウントで作成したプロジェクトに招待してもらう形で利用
    - users テーブル：id(uuid), nickname(text), email(text)、INSERT / SELECT ポリシー設定済み
    - posts テーブル：id(uuid), user_id(uuid), title(varchar), body(varchar),
      hashtags(text[]), is_public(boolean), created_at(timestamptz)
      外部キー：user_id → users(id)
      RLS：SELECT ポリシー設定済み（INSERT ポリシーは未設定）
    - Confirm email OFF 設定済み
    - トリガーは未設定。register.tsx 側で insert している

  次のタスク
  - app/post/[id].tsx を完成させる（現状：title/body 表示まで）
  - hooks/useSession.ts に onAuthStateChange を追加してセッション変化を検知できるようにする
    - tennis-note2 の実装を参考に、getSession の下に追加し return で unsubscribe する
  - window.alert(email) のデバッグ用アラートを login.tsx から削除
  - AsyncStorage の設定（スマホ対応）
  - posts テーブルの INSERT ポリシー設定（現状動いているか要確認）
  - フッター整える・使わないタブ非表示
  - テーマカラー適用
  - git アップしてスマホで確認

  memo.md の構成
  - 上部：自分の学びメモ（文言そのまま保持）
  - 下部（--- が2つ以降）：AI補足欄
  - constants/memoContent.ts に文字列として持ち、memo タブで Markdown 表示

  方針メモ
  - 認証方式：ニックネーム + パスワード。メアドは36進数ランダム文字列で裏で自動生成
  - storageAdapter に AsyncStorage を設定する（lib/supabase.ts）
  - tennis-note2 の構造を参考にしながら自力で実装


ログイン押下後、画面が遷移せずに止まる
➡コンソールに色々出ているから確認

ログイン後にそのユーザ情報をどこに保存しているのか。その値をどこで識別してその人用の画面を出しているのか。
postのid.tsxも確認


ホームで投稿押下後の画面遷移
まずは投稿を取得する事


フッター整える
使わないやつ一旦非表示

テーマカラー適用
gitアップしてスマホで確認

要望画面を自作する