import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useSession() {
  const[session, setSession] = useState<Session | null>(null);
  const[loading, setLoading] = useState(true);

  // supabaseのauthからセッション情報を取ってきて、戻り値dataからsessionだけを取り出して変数に代入。処理が完了したらloadingをfalseに。

useEffect(() => {
  supabase.auth.getSession().then(({ data: {session} }) => {
    setSession(session);
    setLoading(false);
  });

    // onAuthStateChangeを使ってsupabase.authのログイン・ログアウト・セッション変化を監視。検知された場合発火してsessionを代入。
  // 最後にsessionとloadingをreturnする。
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event,
    session) => {
      setSession(session);
});

  return () => subscription.unsubscribe();
}, []);


  return { session, loading };
}