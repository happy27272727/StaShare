# 開発メモ

---
# フロントエンド
React Native
- iosとAndroidとWebを一つのコードで動かすためのフレームワーク
- これが無いと、iOS用にSwift、Android用にKotlin、Web用にReactと、3つの別
  々のコードを書く必要があるから大変

Expo
- react nativeの開発を楽にするツールセット（ビルドやデプロイをいい感じに設定してくれる）
- これが無いと、ビルドなどの設定に数日かかる

expo router
- ファイルベースルーティング。フォルダ構造がそのまま画面遷移になる。
- これが無いと、画面を追加する度にimport・登録・遷移名の指定が必要になる。
expo routerを使うと、ファイルを作れば自動でそれを読んで画面遷移を制御してくれる。

# バックエンド
supabase
- データベース・認証・APIをまとめて提供するサービス
- ポスグレ：テーブル形式でデータを保存するDB
- 認証：メール・パスワードのログイン機能を自分で作らなくていい。signUp()とか用意された関数がある。

# デプロイ
Vercel
- ビルドしたアプリを公開するホスティングサービス
- HTMLやJSのファイルを置いたら、世界中からアクセスできるURLを発行してくれるサービス

GitHub
- コードの管理と、Vercelへの自動デプロイ
- 毎回Vercelに手動でファイルをアップロードするのは面倒だから、「git push」をトリガーとして自動でビルドとアップロードをしてくれる

# _layoutの役割（よくわからん）
- 全画面や各画面の共通アイテム（ヘッダー・共通処理「戻る」・テーマカラー）を扱う

# default function
- 一番に読み込まれるかつ、他ファイルから呼び出し可能
- stylesがCSSの定義が色々入ったオブジェクト
default function HomeScreen() {
処理
return(
  JSX(jsの中に変数や条件分岐とかHTMLみたいなのとかなんでも書けるやつ)
)
}
const styles = StyleSheet.create({
  変数名（プロパティ）: {CSS的な}
})

# useEffectの基本構文
useEffect(() => {
  実行したい処理
}, [依存配列]);
- 依存配列で指定した変数の値が変化するとuseEffectがそれを検知して処理を実行する
- 依存配列が空の場合、初回レンダリング時に一回だけ実行
- 依存配列が無い場合、毎レンダリングで実行

# アロー関数の基本構文
const functionName = (arg) => {
  処理
};
- 一行でかける場合はreturnと{}省略できる

# constとlet
const [password, setPassword] = useState("");
setPasswordを呼ぶと、「引数として渡した値をpasswordに代入する処理」を次のレンダリング時に実行するという予約をする。その時点で代入されるわけではない。レンダリングされるまでは古い値が使われる。
- const: 再代入不可
- let: 再代入可能

# useStateとは
値の変化をReactに知らせて再レンダリングを起こす
state = 変数の状態
stateが変わるとreactが勝手に再描画してくれる。
その仕組みを使うためにuseStateを使っている

# setするとuseStateが値の変化を検知してReactに再レンダリングの命令を出す。再レンダリングで変数にsetした値が代入される


# 分割代入
const { name, age } = user; 
- userオブジェクトからnameとageを取り出して代入してる
- const { data, error} = await supabase.auth.signUp();みたいな結構使う



# 処理フロー
リンクアクセス後、_layout➡indexの順で読まれる。
_layoutは各画面のヘッダーとかスタックを管理する？

- リンクアクセス後、まずappの_layoutが読まれ、画面が表示される。
- useEffectは画面描画を検知後に発火する
- router.replace('/auth/login');で画面切り替え

- 常にアクセスしたフォルダのlayoutが読まれる。
- もしそのフォルダ内にindexがある場合、それを表示させる
- ない場合、layoutのreplaceにあるパスに飛ぶ
- またそのフォルダ内のlayoutを読む            
- indexが無くてもreplaceでファイル名まで指定してれば問題ない 

- router.replace('/auth/login');で指定してもそのフォルダ内に_layoutがあるとそれが優先- 的に読まれる。ここに問題があると画面は表示されない

- const { session, loading } = useSession();
- useSession()の中にconst sessionとconst loadingがある
- それを取り出している。➡分割代入
- ログイン中のユーザ情報とセッション確認（サーバから返事が来たかtrue or false）

起動時にスタックの底をホーム画面にセット。その後のセッション確認で登録済みユーザの場合はreplace(tabs)で切り替える。
未登録の場合、replace(login)でログイン画面に遷移する
replaceされた瞬間に画面が切り替わる

---

# default function

- 一番に読み込まれるかつ、他ファイルから呼び出し可能

- appのlayoutの最初のexport const unstable_settings = {initialRouteName: '(tabs)',};で
スタックの一番下をtabsにあるindexに定義する。そのあとuseeffectでセッションチェックを
行い、RootLayoutNav()でログイン画面とtabsのindexどちらに送るか決めている。
実際に画面表示を制御しているのはuseEffect。

---

# <Stack>の意味

- スタック＝積み上げる
- 画面を積み上げる事で「戻る」「次」とかを制御してる
- <Stack.Screen name="index" redirect />
- stackはデフォルトでヘッダーを表示する仕様
- ヘッダーの文言はname=で指定したファイル名
- headerShown: falseで非表示にできる
- appのlayoutのStackがauthや(tabs)などのトップレベルのヘッダーを管理。トップレベルフォルダ内のlayoutのStackがフォルダ内のファイルヘッダーを管理している。そのstackでfalseにしないと、フォルダ名やファイル名がヘッダーに表示される
- ファイル内に<Stack />を書く事で、スタックを使った画面遷移制御に参加できるようになる

---

# useEffectのイメージ

- イベントリスナーに近い
- []空ならコンストラクタ処理（最初に一度だけ実行）
- 値を入れると、その値が変わるたびに実行（変更イベントのリスナー）

---

# ボタン押下時の画面遷移方法

- ➀<touchableOpacity>を<Link>で囲む ↓（asChildを付けないとlinkがボタンになる）
    <Link href="/auth/register" asChild>
      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkText}>アカウントをお持ちでない方はこちら</Text>
      </TouchableOpacity>
    </Link>

- ②<touchableOpacity>のonPressでreplaceする
- onPress={() => router.replace('/auth/register')}
- onPressには関数を指定しないとダメ
➡ほぼ同じ。Linkの方がシンプル。replace使うとvaliチェックとか挟める

---

# キーワードメモ

- <KeyboardAvoidingView> 入力でキーボード出てきた時に画面が崩れない
- <Text>子要素<Text> 子要素が無い時は<Text />でOK
- React — Web 用の UI ライブラリ。<div> や <p> などの HTML 要素を使う
- React Native — モバイルアプリ用。<View> や <Text> などのネイティブ要素を使う
- ➡JSXはreact-nativeに多い
- loading && styles.buttonDisabled &&は左辺がtrueの時のみ右辺を実行

---

# ハイライトの意味

- 緑色はJSX。HTMLみたいな記法を出来るようにしたもの。returnで返される。returnに書く。
- 複数のjsxを書くときはフラグメント<>を使って一つにグループ化しないといけない

---

# ''と""の違い
JSの値（｛｝の中にかくやつ）は''
JSXのprops（HTMLでいう属性）には""

---

# const [nickname, setNickname] = useState('');
- nicknameという変数を定義して初期値に空白を入れている。
- setNicknameで値を更新できる
- onChangeText={setNickname}は一文字変化する度にsetされる
- autoCorrect={false}➡自動修正機能OFF。
- tehと打つと自動でtheに変換されるやつ

# npm run web

# アロー関数とラムダ式
- 呼び方が違うだけ
- JavaScript / TypeScript → アロー関数                                               
- Python / Java / C# → ラムダ式
- onPress={() => router.back()}
- () → 引数なし
- => → ならば
- router.back() → router.back() を実行する
- onPress={() => window.alert(password)}でpasswordを表示できる
- onPressはボタンが押されたときの情報（タイムスタンプ・座標など）をオブジェクトとして
- 引数に渡している。ほぼ必要ない情報だから()で無視する
- オブジェクトの中身を見たいときはconsole.log()でconsoleから見れる
- (object)はjsの何かの名前と被っているから(e)とかにするのがいいらしい
- onPress={(e) => console.log(e)}

# アロー関数の()と{}の違い
{}➡returnが必要
()➡returnなしでJSXが返される

ハッシュタグ表示
</TouchableOpacity>
{POPULAR_TAGS.map(tag => (
  <TouchableOpacity
    key={tag}
    style={[styles.tagChip, selectedTag === tag && styles.tagChipSelected]}
    onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
  >
    <Text style={[styles.tagText]}>#{tag}</Text>
  </TouchableOpacity>
配列の定数POPULAR_TAGSをmapを使って一個ずつ取り出し、tagに渡す。今回は()だからretun書かずに()内のJSXを返す。

# 三項演算子
 条件 ? trueの時 : falseの時
<Text>{loading ? "登録中..." : "登録する"}</Text> 

# (tabs)かっこのいみ

- Expo Routerのファイルベースうルーティングのルールで、（）で囲んだフォルダは
- URLに含まれないグループフォルダとなる。
- (tabs)/home → URLは /home                                      
- tabs/home → URLは /tabs/home 
➡だからTenShareはlocalhostでアクセス時にtabsの中にindexが一番に表示されている
タブナビゲーションはURLに出る必要がないグループ分けだからtabsにだけ（）がある

# アクセスからの流れ
 router.replace() はスタックを置き換えてる。
  1. アプリ起動 → スタック [(tabs)/index]
  2. セッションなし → router.replace('/auth') → スタック
  [auth/index]（tabsが消えてauthに置き換わる）
  3. auth/index（ログイン画面）から register に遷移 → スタック [auth/index, auth/register]  
  4. register から router.back() → auth/index に戻る ✓

  ループにならない理由は replace がスタックを「追加」ではなく「置き換え」るから
  ログイン画面自体はスタックに普通に含まれる

  ● 登録後に router.replace('/(tabs)') で飛ばす場合：                
  - replace なのでスタックは [(tabs)/index] だけになる
  - ログイン・登録の履歴はスタックから消える
  再アクセス時はセッションあり → replace('/(tabs)') → スタック [(tabs)/index]
  から

# setLoading(true);
  - 「ローディング中」という状態をセットするだけ

# 分割代入
- setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { nickname } },
    });
- auth.signUp()の戻り値は[data, error]というオブジェクト
- const { error }でローカル変数を宣言してsignUp()からの戻り値のerrorを代入している
- 無い場合はnull。その後、if (error)でエラー後の処理を書く

# DBとの繋がり
  register.tsx                                                                              
    ↓ import
  lib/supabase.ts
    ↓ process.env.EXPO_PUBLIC_SUPABASE_URL
  .env.local
    ↓ 値を返す
  EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

ローカル➡env,local
本番    ➡EASの環境変数設定画面
➡本番稼働して環境変数を設定すればローカルは使わなくなる

- signUp()にemailは必須。
- const email = `${nickname}@example.app`で適当に作って送ってる
- signUp()に渡す引数はsignUpで定義されているものしか送れない
- EX passwordとかemail。nicknameとか独自に作った変数は送れないから整える必要がある？
{data: {nickname}}

# onPressの有無
- フレームワーク（expo-router/react-native）が管理する要素はいらない
- タブのタップ、stackの戻るボタン、Link、initialRouteNameなど

# @の意味
- プロジェクトの別名
- C:\jet\projects\HTMLProjects\StaShare\constants\Colors.tsと書かなくても
- '@/constants/Colors'で指定できる

<TextInput
      style={styles.titleInput}
      placeholder="タイトル（例：動的カーソルとは）"
      placeholderTextColor={C.textMuted}
      value={title}
      onChangeText={setTitle}
      />
valueで指定した変数に値を格納かつその値を表示させるから、onChangeTextがないと入力しても表示が変わらない

---
useFontsでデフォルト以外のフォントを読み込んでいる。それが終了するまで画面には何も表示させない。useFontsで分割代入されてerrorに入った場合、下のuseEffectが検知してerrorを投げる

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


# useSession.ts

 supabaseのauthにあるgetsessionという関数を使ってローカルに見に行って、非同期処理の結果を待つthenで戻り値を分割代入してる。dataの中のsessionを出してる。

 useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setLoading(false);
  });
  }, []);

  # useEffect
  末尾に配列で[session, loading, segments] などを入れると、この3つのどれかの値が変化したときにuseEffectが実行される。
  配列を書いてない場合は、毎レンダリングごとに実行される
  ➡再描画の時

# foreignkey
別テーブルの主キーを参照する制約
foreign key(user_id) references users(id)
➡usersに存在するidでないとinsert不可とするため

# awaitはasync関数の中でしか使えない
 const { data: { user } } = await supabase.auth.getUser();

# asyncが必要な関数＝結果を待つ必要がある処理
supabaseへの通信など、結果をもとに処理を行う場合、結果を待たなければいけない。それには時間が掛かる。asyncで非同期処理にする必要がある

# nullチェック typeScriptのルール
supabaseからdata: {user}を取得してuser.idなどで使用する場合、userがnullになる可能性がある型の場合はnullチェックを挟まないとエラーが出る

# postとは
オブジェクトの構造を定義したもの。実際にデータが入るわけではない。型を定義する設計書。

type Post = {
  id: string;
  title: string;
  user_id: string;
  users: { nickname: string;}
}

const [posts, setPosts] = useState<Post[]>([]);
if (!error || data ) setPosts(data as any);
supabaseから取得した値の構造はpostに完全に一致する必要がある。
そのルールをスルーさせるのがas any


  - useFocusEffect → 画面を開くたびに自動でデータを再取得
  - onRefresh → ユーザーが手動で引っ張って更新したいときに再取得

# 権限のsql
create policy "select_posts" on posts
for select
using(true);
➡usingはforを与える相手を指定する。trueの場合は全員許可。

# props
コンポーネントに渡すオブジェクトで、戻り値を分割代入で取り出すイメージ。引数的な。
export default function Avatar({ avatarUrl, nickname, size = 40, onPress }: Props) {}

# queryをletにする理由
後からsqlを書き直せるように

# クエリの順番
sqlの解析準
from where select orderby

# Animated.View
アニメーション付きのView➡滑らかな動き
EX：下にスクロールしたときに200ミリ秒でヘッダーを上に移動させて消す
jsとstyleで制御すると重くてカクカクかも


const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
headerStyleというstyleのオブジェクトと同じ名前の変数を定義してtranslateY.valueが変化する度に値が代入される。その際transformでstyleに変換される 

const [translateY, setTranslateY] = useState(0); これだと値が変わるたびにレンダリングが行われ重い。                                                                                        
const translateY = useSharedValue(0);useSharedValueはアニメーション専用の変数で、レンダリングを必要とせずUIに値を反映できる 


# 登録時の流れ
メアドは36進数の小数点以下の2～8文字を抜き出して${makeemail}@example.com`で自動生成
signUpでpassword, emailがauth.usersに登録
public.usersにはsignUp時の戻り値dataのidとnickname, emailが保存される
id: data.user.id → auth.users の ID をそのまま使う（紐づけのため）
emailとnicknameは定義した変数の値を使う

# selectの書き方
.eq('nickname', nickname) → nickname カラム = 変数nickname

# disabled={loading}
ローディング中はボタンを押せなくなる

# ログイン系の仕組み
hookでuseSessionがある。レンダリングされたときに読み込まれ、getSessionでセッション情報を見に行く。もしデータがある場合、sessionにそのデータを入れる。
onAuthStateChangeはログイン・ログアウト・セッション更新などの認証状態が変わったときに自動で発火する。ログインボタンが押されるとsupabaseが自動でセッションを発行。それを検知してsessionに代入。
最後にsessionとloadingをreturn

# const [session, setSession] = useState<Session | null>(null);
useStateは値が変わると再レンダリングされる
変数sessionの型はSessionかnullのどちらかで初期値はnull

# const[hensu, setHensu] = useState('')。const（定数）で再代入出来る理由
これは代入しているわけではなく、次にレンダリングする時に「この値で代入しろ」という予約をしている状態。つまり、レンダリングされるまでは変数にはレンダリング前の値が入っている。普通の変数みたいに処理のロジックの中では使えない

# useStateとは
state = 状態
stateが変わるとreactが勝手に再描画してくれる。
その仕組みを使うためにuseStateを使っている

# $のいみ
バッククォート ` で囲んだ文字列の中で ${} を使うと、変数や式を文字列に埋め込める

# useLocalSearchParams
useLocalSearchParamsはurlからパラメータを受け取るフック

# ?と??
const uid = user?.id ?? null;
- ?. → user が null/undefined でもエラーにならない
- ?? → 左が null/undefined なら右を使う 

# Promise.all
複数の非同期処理がある場合、順番に直列で実行ではなく、全部完了したら終了

# as anyの役割
typeで定義したオブジェクトの型とDBから取得したオブジェクトがずれる可能性がある。DBのカラムがnullだったとかで。そのずれを許容させるのがas any。型チェックをスルーさせるからあまり良くない。

# single()のいみ
➡オブジェクトとして1件だけ返す
single()がないとeq.で一件しかヒットしてなくてもオブジェクトが配列で返される。
data = [{ id: 'abc', title: 'テスト' }]  // 配列
そうするとpost.titleでデータにアクセスできない。

ホーム画面はデータを複数件取得している。
➡複数のオブジェクトが配列として返されてくる。
{ id: '1', title: '練習記録1', nickname: 'Sota' },
{ id: '2', title: '練習記録2', nickname: 'Taro' },
{ id: '3', title: '練習記録3', nickname: 'Hana' },
これらをsetPostで一旦格納。
FlatListのrenderItemに各オブジェクトをitemとしてに渡してループさせる。
➡item.で取得できるようになる

# タグ押下の仕組み
onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
押下でselectedTagに引数でset。既に変数に押したkeyのタグがある場合、null、ない場合はそのタグを入れる


---
---

# AI補足

## router.replace / push / back の使い分け
- `replace` → 現在の画面をスタックから消して新しい画面に切り替える。戻れない
- `push` → スタックに積む。戻るボタンで前の画面に戻れる
- `back` → スタックを一つ戻る

## AsyncStorage について
- `lib/supabase.ts` の `storageAdapter` が `undefined` のまま
- ブラウザでは `localStorage` が代わりに使われるので動いているが、スマホ（iOS/Android）では動かない
- `expo-install expo-secure-store` などで AsyncStorage を設定する必要がある

## TypeScript の型 `Session | null`
- `|` は「または」の意味。`Session | null` は「Session 型か null のどちらか」
- null になりうる型に対して `.id` などでアクセスするとコンパイルエラーになる（nullチェックが必要な理由）

## Supabase の操作の使い分け
- `supabase.auth.*` → 認証系（signUp, signIn, getUser, getSession など）
- `supabase.from('テーブル名').*` → DB 操作（insert, select, update, delete）

## UUID について
- Universally Unique Identifier の略。世界中で重複しない一意なID
- Supabase がユーザー作成時に自動生成する
- `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` の形式

## useEffect の実行タイミングまとめ
- 依存配列なし → 毎レンダリング後に実行
- `[]` → 初回レンダリング後に1度だけ実行
- `[a, b]` → a または b が変化したときに実行

## TouchableOpacity のネスト問題
- 外側の TouchableOpacity の中に内側の TouchableOpacity を入れると、タップイベントが外側に吸収される場合がある
- ボタンは並列に並べるのが基本

## ログイン時のメアド取得フロー（StaShare）
- ユーザーはニックネーム + パスワードのみ入力
- `public.users` テーブルから `.eq('nickname', nickname)` で email を取得
- `.single()` を使うと配列でなくオブジェクトで返るので `data.email` で取り出せる（`.single()` なしは `data[0].email`）
- 取得した email と入力 password を `signInWithPassword` に渡す
- error の変数名が重複する場合は `error: fetchError` / `error: signInError` のように別名をつける

## RLS ポリシーの using / with check の違い
- `using` → SELECT / DELETE に使う（取得・削除する行を絞る条件）
- `with check` → INSERT / UPDATE に使う（書き込む行を絞る条件）
- SELECT に `with check` を書いてもエラーにはならないが意味がない

## onAuthStateChange の仕組み
- Supabase が提供するリスナー
- `signInWithPassword` が成功した瞬間に Supabase がセッションを自動発行
- それを検知して `session` が更新 → `_layout.tsx` の useEffect が発火 → `/(tabs)` に遷移

## export default と名前付き export の違い
- `export default` → 1ファイルに1つだけ。import 側は `import Foo from '...'`
- `export function Foo` → 複数書ける。import 側は `import { Foo } from '...'`

## optional chaining `?.`
- `data?.email` は `data` が null / undefined のとき `.email` にアクセスせず `undefined` を返す
- `?` を外すと null の場合にランタイムエラーになる

## currentUserId の役割
- ログイン中のユーザーの ID を保持する state
- 「誰が何をしていいか」を制御するために使う
- いいね・コメント送信のガード、自分のコメントだけ削除ボタン表示、自分の投稿だけ編集ボタン表示など

## Promise.all
- 複数の非同期処理を並列（同時）実行して全部終わったら結果をまとめて受け取る
- 直列だと合計時間がかかるが、Promise.all なら一番遅い処理が終わるまでの時間で済む

## ネストした分割代入
- `const { data: { user } } = await supabase.auth.getUser();`
- `data` を取り出しつつ、その中の `user` をさらに取り出す 2 段階の分割代入

## `||` vs `&&` の条件式（成功チェック）
- `!error && data` → エラーなし かつ データあり → 両方満たしたときだけ処理する（成功時のみ）
- `!error || data` → どちらかが true なら処理してしまう → 意図しない動作になりやすい

## Supabase の `.contains()`
- 配列型カラムに特定の値が含まれるかを調べる
- `.contains('hashtags', ['JAVA'])` → hashtags 配列に 'JAVA' が含まれる行だけ取得
- タグフィルタリングに使う

## `.finally()`
- Promise チェーンの成功・失敗どちらでも必ず実行される処理
- ローディングフラグのリセットなど「結果に関わらず必ずやること」に使う

## `filter()` と スプレッド構文 `...`
- `arr.filter(x => x !== target)` → target 以外の要素だけ残した新しい配列を返す（削除）
- `[...prev, newItem]` → 既存配列を展開して末尾に追加した新しい配列を作る（追加）
- `[prev, newItem]` だと入れ子になってしまうので `...` で展開が必要

## フローティングヘッダーの実装パターン
- `Animated.View` に `position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100` をつけて上に重ねる
- FlatList の `contentContainerStyle={{ paddingTop: TOTAL_H }}` でヘッダー分のスペースを空ける
- これがないとカードがヘッダーの裏に隠れて見えなくなる

## `useFocusEffect` の発火条件
- 画面にフォーカスが当たったときに実行される（画面を開いたとき・戻ってきたとき）
- 画面が表示中に state が変化しても再発火しない
- selectedTag の変化に反応させるには `useEffect([selectedTag])` の方が適切な場合がある

## `keyExtractor` の役割
- FlatList の各アイテムに一意なキーを付ける
- これがないとデータが変化したときに正しく再描画されないことがある
- `keyExtractor={item => item.id}` のように書く

## Supabase JOIN の外部キー明示
- `.select('id, title, users(nickname)')` → 外部キーが 1 つなら省略可
- `.select('id, title, users!posts_user_id_fkey(nickname)')` → 外部キーが複数ある場合に使う外部キー名を明示する

## タブを非表示にする方法
- `Tabs.Screen` の `options` に `href: null` を渡すとタブバーから消える
- ファイルを削除しなくてもルートを維持したまま非表示にできる

## react-native-reanimated と babel.config.js
- `react-native-reanimated` はネイティブ（iOS/Android）でビルド時にコード変換が必要
- プロジェクトルートに `babel.config.js` を作り `plugins: ['react-native-reanimated/plugin']` を追加しないとネイティブでクラッシュする
- Webはブラウザのエンジンで動くので設定なしでも動いてしまい気づきにくい

## useSafeAreaInsets
- iPhoneのノッチやホームバーの高さを取得するフック
- `const insets = useSafeAreaInsets()` で取得し `paddingTop: insets.top` のようにスタイルに使う
- `StyleSheet.create` の外では使えない（hooks はコンポーネント内でのみ呼べる）のでインラインスタイルで渡す

## keyboardShouldPersistTaps="handled"
- `ScrollView` のプロパティ
- タップがボタンなどに処理されなかった場合にキーボードを閉じる
- これがないと入力欄以外をタップしてもキーボードが閉じない

## TRUNCATE CASCADE
- 外部キー制約があるテーブルを全削除したいとき `TRUNCATE TABLE users CASCADE;` とすると紐づくテーブル（posts など）も一緒に削除される

## Vercel デプロイの注意点
- `.env.local` は GitHub にアップされないので Vercel の Settings → Environment Variables で別途設定が必要
- Expo Router は SPA なので `vercel.json` に `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }` を書かないと直接URLアクセス時に真っ白になる


