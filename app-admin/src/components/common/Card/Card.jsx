import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const Card = ({ children, style, onPress }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

Card.Header = ({ children, style }) => (
  <View style={[styles.header, style]}>{children}</View>
);

Card.Body = ({ children, style }) => (
  <View style={[styles.body, style]}>{children}</View>
);

Card.Footer = ({ children, style }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

Card.Title = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  body: {
    padding: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
});

export default Card;