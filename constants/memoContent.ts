export const MEMO_CONTENT = `
# 開発メモ

---

# 処理フロー・アクセスの流れ

- アクセス後、まずappの_layoutが読まれ、画面が表示される。
- useEffectは画面描画を検知後に発火する
- router.replace('/auth/login');で画面切り替え

- 常にアクセスしたフォルダのlayoutが読まれる。
- もしそのフォルダ内にindexがある場合、それを表示させる
- ない場合、layoutのreplaceにあるパスに飛ぶ
- またそのフォルダ内のlayoutを読む
- indexが無くてもreplaceでファイル名まで指定してれば問題ない

- router.replace('/auth/login');で指定してもそのフォルダ内に_layoutがあるとそれが優先的に読まれる。ここに問題があると画面は表示されない

- const { session, loading } = useSession();
- useSession()の中にconst sessionとconst loadingがある
- それを取り出している。➡分割代入
- ログイン中のユーザ情報とセッション確認（サーバから返事が来たかtrue or false）

起動時にスタックの底をホーム画面にセット。その後のセッション確認で登録済みユーザの場合はreplace(tabs)で切り替える。
未登録の場合、replace(login)でログイン画面に遷移する
replaceされた瞬間に画面が切り替わる

router.replace() はスタックを置き換えてる。
1. アプリ起動 → スタック [(tabs)/index]
2. セッションなし → router.replace('/auth') → スタック [auth/index]（tabsが消えてauthに置き換わる）
3. auth/index（ログイン画面）から register に遷移 → スタック [auth/index, auth/register]
4. register から router.back() → auth/index に戻る ✓

ループにならない理由は replace がスタックを「追加」ではなく「置き換え」るから
ログイン画面自体はスタックに普通に含まれる

● 登録後に router.replace('/(tabs)') で飛ばす場合：
- replace なのでスタックは [(tabs)/index] だけになる
- ログイン・登録の履歴はスタックから消える
再アクセス時はセッションあり → replace('/(tabs)') → スタック [(tabs)/index] から

---

# _layout.tsxの役割
- 全画面や各画面の共通アイテム（ヘッダー・共通処理「戻る」・テーマカラー）を扱う

---

# default function

- 一番に読み込まれるかつ、他ファイルから呼び出し可能

- appのlayoutの最初のexport const unstable_settings = {initialRouteName: '(tabs)',};でスタックの一番下をtabsにあるindexに定義する。そのあとuseeffectでセッションチェックを行い、RootLayoutNav()でログイン画面とtabsのindexどちらに送るか決めている。実際に画面表示を制御しているのはuseEffect。

---

# useFonts

useFontsでデフォルト以外のフォントを読み込んでいる。それが終了するまで画面には何も表示させない。useFontsで分割代入されてerrorに入った場合、下のuseEffectが検知してerrorを投げる

\`\`\`
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}
\`\`\`

---

# useSession.ts

supabaseのauthにあるgetsessionという関数を使ってローカルに見に行って、非同期処理の結果を待つthenで戻り値を分割代入してる。dataの中のsessionを出してる。

\`\`\`
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setLoading(false);
  });
}, []);
\`\`\`

---

# Stackの意味

- スタック＝積み上げる
- 画面を積み上げる事で「戻る」「次」とかを制御してる
- \`<Stack.Screen name="index" redirect />\`
- stackはデフォルトでヘッダーを表示する仕様
- ヘッダーの文言はname=で指定したファイル名
- headerShown: falseで非表示にできる
- appのlayoutのStackがauthや(tabs)などのトップレベルのヘッダーを管理。トップレベルフォルダ内のlayoutのStackがフォルダ内のファイルヘッダーを管理している。そのstackでfalseにしないと、フォルダ名やファイル名がヘッダーに表示される
- ファイル内に\`<Stack />\`を書く事で、スタックを使った画面遷移制御に参加できるようになる

---

# useEffectのイメージ

- イベントリスナーに近い
- []空ならコンストラクタ処理（最初に一度だけ実行）
- 値を入れると、その値が変わるたびに実行（変更イベントのリスナー）

末尾に配列で[session, loading, segments] などを入れると、この3つのどれかの値が変化したときにuseEffectが実行される。
配列を書いてない場合は、毎レンダリングごとに実行される
➡再描画の時

---

# 画面遷移の方法

- ①\`<touchableOpacity>\`を\`<Link>\`で囲む ↓（asChildを付けないとlinkがボタンになる）

\`\`\`
<Link href="/auth/register" asChild>
  <TouchableOpacity style={styles.linkButton}>
    <Text style={styles.linkText}>アカウントをお持ちでない方はこちら</Text>
  </TouchableOpacity>
</Link>
\`\`\`

- ②\`<touchableOpacity>\`のonPressでreplaceする
- onPress={() => router.replace('/auth/register')}
- onPressには関数を指定しないとダメ
➡ほぼ同じ。Linkの方がシンプル。replace使うとvaliチェックとか挟める

フレームワーク（expo-router/react-native）が管理する要素はonPress不要
- タブのタップ、stackの戻るボタン、\`<Link>\`、initialRouteNameなど

---

# useState

- const [nickname, setNickname] = useState('');
- nicknameという変数を定義して初期値に空白を入れている。
- setNicknameで値を更新できる
- onChangeText={setNickname}は一文字変化する度にsetされる
- autoCorrect={false}➡自動修正機能OFF。tehと打つと自動でtheに変換されるやつ

- setLoading(true);「ローディング中」という状態をセットするだけ

\`\`\`
<TextInput
  style={styles.titleInput}
  placeholder="タイトル（例：動的カーソルとは）"
  placeholderTextColor={C.textMuted}
  value={title}
  onChangeText={setTitle}
/>
\`\`\`
valueで指定した変数に値を格納かつその値を表示させるから、onChangeTextがないと入力しても表示が変わらない

---

# アロー関数とラムダ式
- 呼び方が違うだけ
- JavaScript / TypeScript → アロー関数
- Python / Java / C# → ラムダ式
- onPress={() => router.back()}
  - () → 引数なし
  - => → ならば
  - router.back() → router.back() を実行する
- onPress={() => window.alert(password)}でpasswordを表示できる
- onPressはボタンが押されたときの情報（タイムスタンプ・座標など）をオブジェクトとして引数に渡している。ほぼ必要ない情報だから()で無視する
- オブジェクトの中身を見たいときはconsole.log()でconsoleから見れる
- (object)はjsの何かの名前と被っているから(e)とかにするのがいいらしい
- onPress={(e) => console.log(e)}

---

# async/await

awaitはasync関数の中でしか使えない
\`const { data: { user } } = await supabase.auth.getUser();\`

asyncが必要な関数＝結果を待つ必要がある処理
supabaseへの通信など、結果をもとに処理を行う場合、結果を待たなければいけない。それには時間が掛かる。asyncで非同期処理にする必要がある

---

# 分割代入

\`\`\`
setLoading(true);
const { error } = await supabase.auth.signUp({
  email, password, options: { data: { nickname } },
});
\`\`\`
- auth.signUp()の戻り値は[data, error]というオブジェクト
- const { error }でローカル変数を宣言してsignUp()からの戻り値のerrorを代入している
- 無い場合はnull。その後、if (error)でエラー後の処理を書く

---

# nullチェック typeScriptのルール

supabaseからdata: {user}を取得してuser.idなどで使用する場合、userがnullになる可能性がある型の場合はnullチェックを挟まないとエラーが出る

---

# DBとの繋がり

\`\`\`
register.tsx
  ↓ import
lib/supabase.ts
  ↓ process.env.EXPO_PUBLIC_SUPABASE_URL
.env.local
  ↓ 値を返す
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
\`\`\`

ローカル➡env,local
本番    ➡EASの環境変数設定画面
➡本番稼働して環境変数を設定すればローカルは使わなくなる

- signUp()にemailは必須。
- const email = \`\${nickname}@example.app\`で適当に作って送ってる
- signUp()に渡す引数はsignUpで定義されているものしか送れない
- EX passwordとかemail。nicknameとか独自に作った変数は送れないから整える必要がある？{data: {nickname}}

---

# foreignkey

別テーブルの主キーを参照する制約
\`foreign key(user_id) references users(id)\`
➡usersに存在するidでないとinsert不可とするため

---

# JSX・TypeScript基本

- 緑色はJSX。HTMLみたいな記法を出来るようにしたもの。returnで返される。returnに書く。
- 複数のjsxを書くときはフラグメント\`<>\`を使って一つにグループ化しないといけない
- JSの値（｛｝の中にかくやつ）は''
- JSXのprops（HTMLでいう属性）には""

---

# キーワードメモ

- \`<KeyboardAvoidingView>\` 入力でキーボード出てきた時に画面が崩れない
- \`<Text>子要素<Text>\` 子要素が無い時は\`<Text />\`でOK
- React — Web 用の UI ライブラリ。\`<div>\` や \`<p>\` などの HTML 要素を使う
- React Native — モバイルアプリ用。\`<View>\` や \`<Text>\` などのネイティブ要素を使う
- ➡JSXはreact-nativeに多い
- loading && styles.buttonDisabled &&は左辺がtrueの時のみ右辺を実行
- npm run web

---

# @の意味

- プロジェクトの別名
- C:\\jet\\projects\\HTMLProjects\\StaShare\\constants\\Colors.tsと書かなくても
- '@/constants/Colors'で指定できる

---

# (tabs)かっこのいみ

- Expo Routerのファイルベースうルーティングのルールで、（）で囲んだフォルダはURLに含まれないグループフォルダとなる。
- (tabs)/home → URLは /home
- tabs/home → URLは /tabs/home
➡だからTenShareはlocalhostでアクセス時にtabsの中にindexが一番に表示されている
タブナビゲーションはURLに出る必要がないグループ分けだからtabsにだけ（）がある
`;
