import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().optional(),
});

const adminSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = ({ navigation }) => {
  const { register: registerCompany, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [companyData, setCompanyData] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(step === 1 ? companySchema : adminSchema),
    defaultValues: step === 1 ? {
      companyName: '',
      companyEmail: '',
      phone: '',
      companySize: '',
      industry: '',
    } : {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onNext = async (data) => {
    if (step === 1) {
      setCompanyData(data);
      setStep(2);
    }
  };

  const onSubmit = async (data) => {
    const finalData = {
      ...companyData,
      ...data,
    };
    
    const result = await registerCompany(finalData);
    if (result.success) {
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } else {
      Alert.alert('Registration Failed', result.error || 'Something went wrong');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, step >= 1 && styles.stepNumberActive]}>1</Text>
        </View>
        <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>
          Company
        </Text>
      </View>
      
      <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
          <Text style={[styles.stepNumber, step >= 2 && styles.stepNumberActive]}>2</Text>
        </View>
        <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>
          Admin
        </Text>
      </View>
    </View>
  );

  const renderCompanyStep = () => (
    <View style={styles.form}>
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Company Name"
            value={value}
            onChangeText={onChange}
            placeholder="Enter your company name"
            error={errors.companyName?.message}
            icon="domain"
          />
        )}
      />

      <Controller
        control={control}
        name="companyEmail"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Company Email"
            value={value}
            onChangeText={onChange}
            placeholder="Enter company email"
            keyboardType="email-address"
            error={errors.companyEmail?.message}
            icon="email"
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Phone Number"
            value={value}
            onChangeText={onChange}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phone?.message}
            icon="phone"
          />
        )}
      />

      <Controller
        control={control}
        name="companySize"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Company Size"
            options={[
              { value: '1-10', label: '1-10 employees' },
              { value: '11-50', label: '11-50 employees' },
              { value: '51-200', label: '51-200 employees' },
              { value: '201-500', label: '201-500 employees' },
              { value: '501+', label: '501+ employees' },
            ]}
            value={value}
            onValueChange={onChange}
            error={errors.companySize?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="industry"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Industry (Optional)"
            options={[
              { value: 'technology', label: 'Technology' },
              { value: 'retail', label: 'Retail' },
              { value: 'manufacturing', label: 'Manufacturing' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'education', label: 'Education' },
              { value: 'other', label: 'Other' },
            ]}
            value={value}
            onValueChange={onChange}
          />
        )}
      />

      <Button
        title="Continue"
        onPress={handleSubmit(onNext)}
        style={styles.button}
      />
    </View>
  );

  const renderAdminStep = () => (
    <View style={styles.form}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Full Name"
            value={value}
            onChangeText={onChange}
            placeholder="Enter your full name"
            error={errors.fullName?.message}
            icon="account"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email Address"
            value={value}
            onChangeText={onChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email?.message}
            icon="email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            error={errors.password?.message}
            icon="lock"
            rightElement={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray[600]}
                />
              </TouchableOpacity>
            }
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            placeholder="Confirm your password"
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword?.message}
            icon="lock-check"
            rightElement={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray[600]}
                />
              </TouchableOpacity>
            }
          />
        )}
      />

      <Controller
        control={control}
        name="terms"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => onChange(!value)}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && <Icon name="check" size={16} color={colors.white} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        )}
      />
      {errors.terms && (
        <Text style={styles.errorText}>{errors.terms.message}</Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          variant="outline"
          onPress={() => setStep(1)}
          style={styles.halfButton}
        />
        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.halfButton}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start your 14-day free trial
            </Text>
          </View>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form */}
          {step === 1 ? renderCompanyStep() : renderAdminStep()}

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: colors.primary[500],
  },
  stepNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[600],
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
  },
  stepLabelActive: {
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.sm,
  },
  stepLineActive: {
    backgroundColor: colors.primary[500],
  },
  form: {
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  halfButton: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray[300],
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  termsText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  termsLink: {
    color: colors.primary[600],
    fontWeight: typography.weights.medium,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.danger[600],
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  loginLink: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary[600],
  },
});

export default Register;