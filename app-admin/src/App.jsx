import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
// import './services/notificationService';
import Loading from "./components/common/Loading";
import AuthNavigator from "./components/navigation/AuthNavigator";
import MainNavigator from "./components/navigation/MainNavigator";
import "./global.css";
import { theme } from "./theme";

export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme: currentTheme, isLoading: themeLoading } = useTheme();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize app services here
      setAppReady(true);
    } catch (error) {
      console.error("App initialization error:", error);
    } finally {
      setAppReady(true);
    }
  };

  if (!appReady || authLoading || themeLoading) {
    return (
      <SafeAreaProvider
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Loading text="Loading app..." />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          style={currentTheme.colorScheme === "dark" ? "light" : "dark"}
          backgroundColor={currentTheme.colors.background}
        />
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
