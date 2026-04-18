


import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaViewBase,
} from "react-native";

const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

const getBalance = async (addr: string) => {
  const result = await rpc("getBalance", [addr]);
  return result.value / 1_000_000_000;
};

const getTokens = async (addr: string) => {
  const result = await rpc("getTokenAccountsByOwner", [
    addr,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { encoding: "jsonParsed" },
  ]);
  return (result.value || [])
    .map((a: any) => ({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.uiAmount,
    }))
    .filter((t: any) => t.amount > 0);
};

const getTxns = async (addr: string) => {
  const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
  return sigs.map((s: any) => ({
    sig: s.signature,
    time: s.blockTime,
    ok: !s.err,
  }));
};

export default function App() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);

  const search = async () => {
    const addr = address.trim();
    if (!addr) return Alert.alert("Enter a wallet address");

    setLoading(true);
    try {
      const [bal, tok, tx] = await Promise.all([
        getBalance(addr),
        getTokens(addr),
        getTxns(addr),
      ]);
      setBalance(bal);
      setTokens(tok);
      setTxns(tx);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  const tryExample = () => {
    const example = "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY";
    setAddress(example);
  };

  return (
    <SafeAreaView style = {s.safe}>
      <ScrollView style = {s.scroll}>
        {/* Header */}
        <Text style = {s.title}>SolScan</Text>
        <Text style = {s.subtitle}>Explore any SOlana wallet</Text>
        
        {/* Search */}
        <View style = {s.inputContainer}>
          <TextInput
            style={s.input}
            placeholder="Solana wallet address..."
            placeholderTextColor="#555"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    marginBottom: 28,
    fontWeight: "400",
  },
  inputContainer: {
    backgroundColor: "#16161D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 14,
    fontWeight: "400",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    backgroundColor: "#14F195",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#14F195",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#0D0D12",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  btnGhost: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#16161D",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  btnGhostText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#16161D",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  label: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
  },
  sol: {
    color: "#14F195",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  addr: {
    color: "#9945FF",
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: 16,
    backgroundColor: "#1E1E28",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  section: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 32,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#16161D",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  mint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  amount: {
    color: "#14F195",
    fontSize: 15,
    fontWeight: "600",
  },
  time: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "400",
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: "600",
  },
});
