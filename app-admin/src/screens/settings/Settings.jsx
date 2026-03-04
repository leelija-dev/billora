import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Settings = () => {
  const { user, company, updateUser, updateCompany } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const {
    profile,
    notifications,
    preferences,
    security,
    loading,
    savingProfile,
    savingPassword,
    savingPreferences,
    savingNotifications,
    loadSettings,
    saveProfile,
    savePassword,
    savePreferences,
    saveNotifications,
    setProfile,
    setNotifications,
    setPreferences,
    setSecurity,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadSettings();
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'account' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'preferences', label: 'Preferences', icon: 'cog' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'company', label: 'Company', icon: 'domain' },
  ];

  const renderProfileTab = () => (
    <Card style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
      
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
          </Text>
        </View>
        <TouchableOpacity style={styles.changeAvatarButton}>
          <Text style={styles.changeAvatarText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Input
          label="First Name"
          value={profile.firstName}
          onChangeText={(text) => setProfile({ firstName: text })}
          placeholder="Enter first name"
          style={styles.rowInput}
        />
        <Input
          label="Last Name"
          value={profile.lastName}
          onChangeText={(text) => setProfile({ lastName: text })}
          placeholder="Enter last name"
          style={styles.rowInput}
        />
      </View>

      <Input
        label="Email Address"
        value={profile.email}
        onChangeText={(text) => setProfile({ email: text })}
        placeholder="Enter email"
        keyboardType="email-address"
      />

      <Input
        label="Phone Number"
        value={profile.phone}
        onChangeText={(text) => setProfile({ phone: text })}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Button
        title="Save Changes"
        onPress={saveProfile}
        loading={savingProfile}
        style={styles.saveButton}
      />
    </Card>
  );

  const renderNotificationsTab = () => (
    <Card style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Notification Preferences</Text>

      <View style={styles.switchItem}>
        <View>
          <Text style={styles.switchLabel}>Email Notifications</Text>
          <Text style={styles.switchDescription}>
            Receive email notifications about your account
          </Text>
        </View>
        <Switch
          value={notifications.emailNotifications}
          onValueChange={(value) => setNotifications({ emailNotifications: value })}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
        />
      </View>

      <View style={styles.switchItem}>
        <View>
          <Text style={styles.switchLabel}>Order Updates</Text>
          <Text style={styles.switchDescription}>
            Get notified about order status changes
          </Text>
        </View>
        <Switch
          value={notifications.orderUpdates}
          onValueChange={(value) => setNotifications({ orderUpdates: value })}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
        />
      </View>

      <View style={styles.switchItem}>
        <View>
          <Text style={styles.switchLabel}>Low Stock Alerts</Text>
          <Text style={styles.switchDescription}>
            Receive alerts when products are running low
          </Text>
        </View>
        <Switch
          value={notifications.lowStockAlerts}
          onValueChange={(value) => setNotifications({ lowStockAlerts: value })}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
        />
      </View>

      <Button
        title="Save Preferences"
        onPress={saveNotifications}
        loading={savingNotifications}
        style={styles.saveButton}
      />
    </Card>
  );

  const renderPreferencesTab = () => (
    <Card style={styles.tabContent}>
      <Text style={styles.sectionTitle}>App Preferences</Text>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Theme</Text>
        <View style={styles.themeButtons}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'light' && styles.themeButtonActive,
            ]}
            onPress={() => {
              if (theme !== 'light') toggleTheme();
            }}
          >
            <Icon
              name="white-balance-sunny"
              size={20}
              color={theme === 'light' ? colors.white : colors.gray[600]}
            />
            <Text
              style={[
                styles.themeButtonText,
                theme === 'light' && styles.themeButtonTextActive,
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'dark' && styles.themeButtonActive,
            ]}
            onPress={() => {
              if (theme !== 'dark') toggleTheme();
            }}
          >
            <Icon
              name="moon-waning-crescent"
              size={20}
              color={theme === 'dark' ? colors.white : colors.gray[600]}
            />
            <Text
              style={[
                styles.themeButtonText,
                theme === 'dark' && styles.themeButtonTextActive,
              ]}
            >
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Select
        label="Language"
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
        ]}
        value={preferences.language}
        onValueChange={(value) => setPreferences({ language: value })}
      />

      <Select
        label="Timezone"
        options={[
          { value: 'utc', label: 'UTC' },
          { value: 'est', label: 'Eastern Time' },
          { value: 'cst', label: 'Central Time' },
          { value: 'mst', label: 'Mountain Time' },
          { value: 'pst', label: 'Pacific Time' },
        ]}
        value={preferences.timezone}
        onValueChange={(value) => setPreferences({ timezone: value })}
      />

      <Select
        label="Date Format"
        options={[
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
        ]}
        value={preferences.dateFormat}
        onValueChange={(value) => setPreferences({ dateFormat: value })}
      />

      <Button
        title="Save Preferences"
        onPress={savePreferences}
        loading={savingPreferences}
        style={styles.saveButton}
      />
    </Card>
  );

  const renderSecurityTab = () => (
    <Card style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Change Password</Text>

      <Input
        label="Current Password"
        value={security.currentPassword}
        onChangeText={(text) => setSecurity({ currentPassword: text })}
        placeholder="Enter current password"
        secureTextEntry
      />

      <Input
        label="New Password"
        value={security.newPassword}
        onChangeText={(text) => setSecurity({ newPassword: text })}
        placeholder="Enter new password"
        secureTextEntry
      />

      <Input
        label="Confirm New Password"
        value={security.confirmNewPassword}
        onChangeText={(text) => setSecurity({ confirmNewPassword: text })}
        placeholder="Confirm new password"
        secureTextEntry
      />

      <Button
        title="Update Password"
        onPress={savePassword}
        loading={savingPassword}
        style={styles.saveButton}
      />

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
      <Text style={styles.description}>
        Add an extra layer of security to your account by enabling two-factor authentication.
      </Text>

      <Button
        title="Enable 2FA"
        variant="outline"
        onPress={() => Alert.alert('Coming Soon', '2FA will be available soon!')}
      />
    </Card>
  );

  const renderCompanyTab = () => (
    <Card style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Company Information</Text>

      <Input
        label="Company Name"
        value={company?.name || ''}
        onChangeText={(text) => updateCompany({ name: text })}
        placeholder="Enter company name"
      />

      <Input
        label="Company Email"
        value={company?.email || ''}
        onChangeText={(text) => updateCompany({ email: text })}
        placeholder="Enter company email"
        keyboardType="email-address"
      />

      <Input
        label="Phone Number"
        value={company?.phone || ''}
        onChangeText={(text) => updateCompany({ phone: text })}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Input
        label="Address"
        value={company?.address || ''}
        onChangeText={(text) => updateCompany({ address: text })}
        placeholder="Enter company address"
        multiline
      />

      <View style={styles.companyStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Plan</Text>
          <Text style={styles.statValue}>{company?.plan || 'Free'}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Status</Text>
          <Text style={[styles.statValue, { color: colors.success[500] }]}>
            {company?.status || 'Active'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Member Since</Text>
          <Text style={styles.statValue}>
            {company?.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>

      <Button
        title="Save Company Info"
        onPress={() => Alert.alert('Success', 'Company information updated')}
        style={styles.saveButton}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account preferences</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
      >
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? colors.primary[500] : colors.gray[600]}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'company' && renderCompanyTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  tabsScroll: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary[500],
  },
  tabLabel: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    marginLeft: spacing.sm,
  },
  activeTabLabel: {
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  tabContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginBottom: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  changeAvatarButton: {
    padding: spacing.xs,
  },
  changeAvatarText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rowInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  switchLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[800],
  },
  switchDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  preferenceItem: {
    marginBottom: spacing.lg,
  },
  preferenceLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    gap: spacing.xs,
  },
  themeButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  themeButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  themeButtonTextActive: {
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.xl,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginBottom: 2,
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
});

export default Settings;