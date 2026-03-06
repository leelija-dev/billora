import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import RegisterForm from '../../components/auth/RegisterForm';
import Loading from '../../components/common/Loading';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const theme = useTheme();
  const [error, setError] = useState(null);

  const handleRegister = async (userData) => {
    try {
      setError(null);
      await register(userData);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading text="Creating account..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RegisterForm
        onSubmit={handleRegister}
        loading={isLoading}
        error={error}
        onLoginPress={handleLoginPress}
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;