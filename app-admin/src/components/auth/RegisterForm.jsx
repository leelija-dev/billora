import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import Button from '../common/Button';
import Header from '../common/Header';
import Input from '../common/Input';

const RegisterForm = ({ onSubmit, loading, error, onLoginPress }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    if (!/[a-z]/.test(password)) return 'Password must contain lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
    if (!/\d/.test(password)) return 'Password must contain number';
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
    if (!firstName) setFirstNameError('First name is required');
    if (firstName.length < 2) setFirstNameError('First name must be at least 2 characters');
  };

  const handleLastNameBlur = () => {
    if (!lastName) setLastNameError('Last name is required');
    if (lastName.length < 2) setLastNameError('Last name must be at least 2 characters');
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) setConfirmPasswordError('Please confirm your password');
    else if (password !== confirmPassword) setConfirmPasswordError('Passwords do not match');
    else setConfirmPasswordError('');
  };

  const onFormSubmit = () => {
    const firstNameValidationError = !firstName ? 'First name is required' : '';
    const lastNameValidationError = !lastName ? 'Last name is required' : '';
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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header title="Create Account" />
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={handleFirstNameChange}
                onBlur={handleFirstNameBlur}
                placeholder="Enter first name"
                error={firstNameError}
                style={styles.nameInput}
              />
            </View>
            <View style={styles.nameField}>
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={handleLastNameChange}
                onBlur={handleLastNameBlur}
                placeholder="Enter last name"
                error={lastNameError}
                style={styles.nameInput}
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
            leftIcon={<Text>📧</Text>}
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
            leftIcon={<Text>🔒</Text>}
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
            leftIcon={<Text>🔒</Text>}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title="Create Account"
            onPress={onFormSubmit}
            loading={loading}
            disabled={!firstName || !lastName || !email || !password || !confirmPassword || loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onLoginPress}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  nameField: {
    flex: 1,
  },
  nameInput: {
    marginBottom: 0,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body2,
    color: theme.colors.error,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  loginText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default RegisterForm;
