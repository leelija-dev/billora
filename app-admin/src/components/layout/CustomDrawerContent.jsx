import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = (props) => {
  const { user, company, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard', route: 'Home' },
    { label: 'Products', icon: 'package-variant', route: 'Products' },
    { label: 'Inventory', icon: 'archive', route: 'Inventory' },
    { label: 'Orders', icon: 'shopping', route: 'Orders' },
    { label: 'Customers', icon: 'account-group', route: 'Customers' },
    { label: 'Invoices', icon: 'file-document', route: 'Invoices' },
    { label: 'Billing', icon: 'credit-card', route: 'Billing' },
    { label: 'Settings', icon: 'cog', route: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          <View style={styles.onlineIndicator} />
        </View>
        
        <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        <View style={styles.companyBadge}>
          <Text style={styles.companyName}>{company?.name || 'Company'}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>{company?.plan || 'Free Plan'}</Text>
          </View>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} style={styles.drawerScroll}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.drawerItem,
              props.state.index === index && styles.activeDrawerItem,
            ]}
            onPress={() => props.navigation.navigate(item.route)}
          >
            <Icon
              name={item.icon}
              size={22}
              color={props.state.index === index ? colors.primary[600] : colors.gray[600]}
            />
            <Text
              style={[
                styles.drawerItemLabel,
                props.state.index === index && styles.activeDrawerItemLabel,
              ]}
            >
              {item.label}
            </Text>
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={toggleTheme} style={styles.bottomItem}>
          <Icon
            name={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
            size={22}
            color={colors.gray[600]}
          />
          <Text style={styles.bottomItemLabel}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={styles.bottomItem}>
          <Icon name="logout" size={22} color={colors.danger[600]} />
          <Text style={[styles.bottomItemLabel, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileSection: {
    padding: spacing.lg,
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.gray[700],
    marginRight: spacing.sm,
  },
  planBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  planText: {
    fontSize: typography.sizes.xs,
    color: colors.primary[700],
    fontWeight: typography.weights.medium,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginVertical: 2,
  },
  activeDrawerItem: {
    backgroundColor: colors.primary[50],
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[600],
  },
  drawerItemLabel: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginLeft: spacing.md,
    flex: 1,
  },
  activeDrawerItemLabel: {
    color: colors.primary[600],
    fontWeight: typography.weights.medium,
  },
  badge: {
    backgroundColor: colors.danger[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  bottomItemLabel: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginLeft: spacing.md,
  },
  logoutText: {
    color: colors.danger[600],
  },
});

export default CustomDrawerContent;