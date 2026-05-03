import { Tabs } from "expo-router";
import { C } from "@/constants/Colors";

export default function tablayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: { backgroundColor: C.headerBrown, borderTopColor: C.border },
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
      options={{ tabBarLabel: 'メモ' }}
      />
    </Tabs>
  );
}
