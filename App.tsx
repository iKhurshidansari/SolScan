import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WalletScreen } from "./src/screens/WalletScreen";
import { SwapScreen } from "./src/screens/SwapScreen";  

function MainApp() {
  const [activeTab, setActiveTab] = useState<"wallet" | "swap">("wallet");
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Screen Switcher */}
      <View style={s.content}>
        {activeTab === "wallet" ? <WalletScreen /> : <SwapScreen />}
      </View>

      {/* Bottom Tab Bar */}
      <View style={[s.tabBar, { paddingBottom: insets.bottom || 8 }]}>
        <TouchableOpacity
          style={s.tab}
          onPress={() => setActiveTab("wallet")}
        >
          <Ionicons
            name={activeTab === "wallet" ? "wallet" : "wallet-outline"}
            size={24}
            color={activeTab === "wallet" ? "#14F195" : "#6B7280"}
          />
          <Text style={[s.tabLabel, activeTab === "wallet" && s.tabActive]}>
            Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.tab}
          onPress={() => setActiveTab("swap")}
        >
          <Ionicons
            name={activeTab === "swap" ? "swap-horizontal" : "swap-horizontal-outline"}
            size={24}
            color={activeTab === "swap" ? "#14F195" : "#6B7280"}
          />
          <Text style={[s.tabLabel, activeTab === "swap" && s.tabActive]}>
            Swap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#16161D",
    borderTopWidth: 1,
    borderTopColor: "#2A2A35",
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  tabActive: {
    color: "#14F195",
  },
});