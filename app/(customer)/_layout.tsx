import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Colors from "@/constants/colors"; // change path if needed

// 🔥 iOS Native Glass Tabs (only if supported)
function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <Icon sf={{ default: "map", selected: "map.fill" }} />
        <Label>Find</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
        <Label>History</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

// 🔥 Android / Web Tabs (FIXED)
function ClassicTabLayout() {
  const isWeb = Platform.OS === "web";
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.dark.accent,
        tabBarInactiveTintColor: Colors.dark.textMuted,

        // ✅ FIXED TAB BAR (NO OVERLAP)
        tabBarStyle: {
          backgroundColor: isIOS ? "transparent" : Colors.dark.surface,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: Colors.dark.border,
          elevation: 0,
          height: 70, // 👈 IMPORTANT FIX
        },

        // Glass effect only for iOS
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: Colors.dark.surface },
              ]}
            />
          ) : null,

        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
        },
      }}
    >
      {/* MAIN TABS */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Find",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* 🔒 HIDDEN SCREENS */}
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="request" options={{ href: null }} />
      <Tabs.Screen name="shop/[id]" options={{ href: null }} />
    </Tabs>
  );
}

// 🔥 MAIN EXPORT
export default function CustomerTabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}