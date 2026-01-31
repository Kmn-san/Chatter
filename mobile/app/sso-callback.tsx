import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
