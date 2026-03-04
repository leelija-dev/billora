import { NavigationContainer } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
// import './services/notificationService';
import AuthNavigator from "./components/navigation/AuthNavigator";
import MainNavigator from "./components/navigation/MainNavigator";
import "./global.css";
import { theme } from "./theme";

// Enhanced Loading Component with Animation
const SplashScreen = ({ progress }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#6b8cff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          {/* Animated Logo Container */}
          <View
            style={{
              width: 128,
              height: 128,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.2)",
              marginBottom: 32,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Image
                source={require("../assets/images/icon.png")}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* App Name */}
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "white",
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            Your App Name
          </Text>

          {/* Tagline */}
          <Text
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Manage your business with ease
          </Text>

          {/* Progress Bar */}
          <View
            style={{
              width: 256,
              height: 8,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                width: progress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                height: "100%",
                backgroundColor: "white",
                borderRadius: 4,
              }}
            />
          </View>

          {/* Loading Text */}
          <Text
            style={{
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
            }}
          >
            Setting things up...
          </Text>
        </Animated.View>
      </View>

      {/* Version Number */}
      <Text
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
        }}
      >
        Version 1.0.0
      </Text>
    </LinearGradient>
  );
};

// Enhanced Loading Component
const AppLoadingScreen = () => {
  const [progress] = useState(new Animated.Value(0));
  const loadingTexts = [
    "Loading awesome features...",
    "Preparing your dashboard...",
    "Almost there...",
    "Welcome back!",
  ];
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to 100 over 3 seconds
    Animated.timing(progress, {
      toValue: 100,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Cycle through loading texts
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SplashScreen progress={progress} />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
};

// Theme-aware Status Bar
const ThemedStatusBar = ({ currentTheme }) => {
  const backgroundColor =
    currentTheme?.colors?.background || theme.colors.background;
  const barStyle = currentTheme?.colorScheme === "dark" ? "light" : "dark";

  return (
    <StatusBar
      style={barStyle}
      backgroundColor={backgroundColor}
      translucent={false}
    />
  );
};

// Main App Component with proper animation
export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme: currentTheme, isLoading: themeLoading } = useTheme();
  const [appReady, setAppReady] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Fade in content when app is ready
    if (appReady && !authLoading && !themeLoading && !initializing) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [appReady, authLoading, themeLoading, initializing]);

  const initializeApp = async () => {
    try {
      // Simulate initialization with minimum display time
      await Promise.all([
        // Add your initialization services here
        new Promise((resolve) => setTimeout(resolve, 2000)), // Minimum splash screen time
      ]);

      setAppReady(true);
    } catch (error) {
      console.error("App initialization error:", error);
    } finally {
      setInitializing(false);
    }
  };

  // Show enhanced splash screen during initialization
  if (!appReady || authLoading || themeLoading || initializing) {
    return <AppLoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ThemedStatusBar currentTheme={currentTheme} />

        {/* Main Content with Fade Animation */}
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
          }}
        >
          {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </Animated.View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
