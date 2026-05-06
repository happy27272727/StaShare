import { Tabs } from "expo-router";
import { C } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function tablayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: { paddingBottom: insets.bottom,  backgroundColor: C.headerBrown, borderTopColor: C.border, height: 58},
        headerStyle: { backgroundColor: C.headerBrown },
        headerTintColor: C.textPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: 'ホーム',
        }}
      />

      <Tabs.Screen
      name='search'
      options={{
        tabBarLabel: 'search',
        href: null
      }} 
      />
      <Tabs.Screen
      name='post'
      options={{ tabBarLabel: '投稿',
        title: 'Note',
      }}
      />
      <Tabs.Screen
      name='profile'
      options={{
        tabBarLabel: 'profile',
        href: null
      }}
      />
      <Tabs.Screen
      name='memo'
      options={{ tabBarLabel: 'メモ',
        href: null
      }}
      />
      <Tabs.Screen 
      name='opinion'
      options={{ tabBarLabel: '要望'}}
      />
    </Tabs>
  );
}
