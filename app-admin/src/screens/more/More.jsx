import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/common/Card/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const More = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      section: 'Management',
      items: [
        { label: 'Inventory', icon: 'archive', route: 'Inventory', color: colors.blue[500] },
        { label: 'Invoices', icon: 'file-document', route: 'Invoices', color: colors.green[500] },
        { label: 'Billing', icon: 'credit-card', route: 'Billing', color: colors.purple[500] },
      ],
    },
    {
      section: 'Settings',
      items: [
        { label: 'Settings', icon: 'cog', route: 'Settings', color: colors.gray[600] },
        { label: 'Profile', icon: 'account', route: 'Profile', color: colors.orange[500] },
        { label: 'Notifications', icon: 'bell', route: 'Notifications', color: colors.red[500] },
      ],
    },
    {
      section: 'Support',
      items: [
        { label: 'Help Center', icon: 'help-circle', route: 'Help', color: colors.cyan[500] },
        { label: 'Contact Us', icon: 'email', route: 'Contact', color: colors.indigo[500] },
        { label: 'About', icon: 'information', route: 'About', color: colors.teal[500] },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Additional features and settings</Text>
      </View>

      {menuItems.map((section, index) => (
        <Card key={index} style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>{section.section}</Text>
          </Card.Header>
          <Card.Body>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Icon name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Icon name="chevron-right" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </Card.Body>
        </Card>
      ))}
    </ScrollView>
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
  sectionCard: {
    margin: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.gray[800],
  },
});

export default More;