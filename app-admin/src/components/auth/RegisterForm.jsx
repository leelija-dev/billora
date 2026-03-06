import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/Button';
import Header from '../common/Header';
import Input from '../common/Input';

const RegisterForm = ({ onSubmit, loading, error, onLoginPress }) => {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(password)) return 'Must contain lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter';
    if (!/\d/.test(password)) return 'Must contain number';
    return '';
  };

  const handleFirstNameChange = (text) => {
    setFirstName(text);
    setFirstNameError('');
  };

  const handleLastNameChange = (text) => {
    setLastName(text);
    setLastNameError('');
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');
  };

  const handleFirstNameBlur = () => {
    if (!firstName) {
      setFirstNameError('First name is required');
    } else if (firstName.length < 2) {
      setFirstNameError('First name must be at least 2 characters');
    } else {
      setFirstNameError('');
    }
  };

  const handleLastNameBlur = () => {
    if (!lastName) {
      setLastNameError('Last name is required');
    } else if (lastName.length < 2) {
      setLastNameError('Last name must be at least 2 characters');
    } else {
      setLastNameError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const onFormSubmit = () => {
    const firstNameValidationError = !firstName ? 'First name is required' : 
      (firstName.length < 2 ? 'First name must be at least 2 characters' : '');
    const lastNameValidationError = !lastName ? 'Last name is required' : 
      (lastName.length < 2 ? 'Last name must be at least 2 characters' : '');
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = !confirmPassword ? 'Please confirm your password' : 
      (password !== confirmPassword ? 'Passwords do not match' : '');
    
    setFirstNameError(firstNameValidationError);
    setLastNameError(lastNameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);
    
    if (!firstNameValidationError && !lastNameValidationError && !emailValidationError && 
        !passwordValidationError && !confirmPasswordValidationError) {
      onSubmit?.({ firstName, lastName, email, password });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['left', 'right']}>
      <Header title="Create Account" showBackButton={true} />
      <View style={{ flex: 1, padding: theme.spacing.lg }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={handleFirstNameChange}
                onBlur={handleFirstNameBlur}
                placeholder="First name"
                error={firstNameError}
                leftIcon="account-outline"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={handleLastNameChange}
                onBlur={handleLastNameBlur}
                placeholder="Last name"
                error={lastNameError}
                leftIcon="account-outline"
              />
            </View>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            error={emailError}
            leftIcon="email-outline"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={handlePasswordBlur}
            placeholder="Create a password"
            secureTextEntry
            returnKeyType="next"
            error={passwordError}
            leftIcon="lock-outline"
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            placeholder="Confirm your password"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={onFormSubmit}
            error={confirmPasswordError}
            leftIcon="lock-check-outline"
          />

          {error && (
            <View style={{
              backgroundColor: theme.colors.error + '20',
              borderWidth: 1,
              borderColor: theme.colors.error,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              marginBottom: theme.spacing.md,
            }}>
              <Text style={{
                ...theme.typography.body2,
                color: theme.colors.error,
                textAlign: 'center',
              }}>{error}</Text>
            </View>
          )}

          <Button
            title="Create Account"
            onPress={onFormSubmit}
            loading={loading}
            disabled={!firstName || !lastName || !email || !password || !confirmPassword || loading}
            style={{ marginTop: theme.spacing.lg }}
          />

          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme.spacing.xl,
          }}>
            <Text style={{
              ...theme.typography.body2,
              color: theme.colors.textSecondary,
            }}>Already have an account? </Text>
            <TouchableOpacity onPress={onLoginPress}>
              <Text style={{
                ...theme.typography.body2,
                color: theme.colors.primary,
                fontWeight: '600',
              }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterForm;