import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useState, useRef } from "react";
import { Stack } from "expo-router";

const API_URL = "https://mechanic-finder-backend.onrender.com";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    const userMsg: Message = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        role: "ai",
        text:
          data.reply ||
          `Check fuel, battery, tyre or contact a mechanic.`,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Server error. Try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "AI Mechanic",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#000", paddingBottom: 10 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* EMPTY STATE */}
        {messages.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              🤖 AI Mechanic
            </Text>

            <Text
              style={{
                color: "#aaa",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Ask anything about your vehicle 🚗
            </Text>
          </View>
        )}

        {/* CHAT LIST */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor:
                  item.role === "user" ? "#f59e0b" : "#1f1f1f",
                padding: 12,
                borderRadius: 15,
                marginVertical: 5,
                alignSelf:
                  item.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              <Text style={{ color: "#fff" }}>{item.text}</Text>
            </View>
          )}
        />

        {/* INPUT BAR (FIXED CLEAN DESIGN) */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: "#000",
            borderTopWidth: 1,
            borderColor: "#222",
          }}
        >
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Type your problem..."
            placeholderTextColor="#666"
            style={{
              flex: 1,
              backgroundColor: "#111",
              color: "#fff",
              borderRadius: 25,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading}
            style={{
              marginLeft: 10,
              backgroundColor: loading ? "#444" : "#007AFF",
              borderRadius: 25,
              paddingHorizontal: 18,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {loading ? "..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}