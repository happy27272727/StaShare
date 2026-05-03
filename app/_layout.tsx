import { Stack, useSegments, useRouter} from "expo-router";
import { useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { C } from '@/constants/Colors';

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

useEffect(() => {
  if(loading) return;
  const inAuthGroup = segments[0] === 'auth';
if (!session && !inAuthGroup) {
  router.replace('/auth/login');
} else if (session && inAuthGroup) {
  router.replace('/(tabs)');
}
}, [session, loading, segments])
return(
  <Stack>
    <Stack.Screen name='auth' options={{ headerShown: false}} />
    <Stack.Screen name='(tabs)' options={{ headerShown: false}} />
    <Stack.Screen name='post/[id]' options={{ title: '記録の詳細', headerBackTitle: '戻る', headerStyle: { backgroundColor: C.headerBrown }, headerTintColor: C.textPrimary }} />
  </Stack>
)
}