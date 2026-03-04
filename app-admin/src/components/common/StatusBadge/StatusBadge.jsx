import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

const StatusBadge = ({ status, variant = 'default', size = 'md' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.success[100],
          textColor: colors.success[700],
        };
      case 'warning':
        return {
          backgroundColor: colors.warning[100],
          textColor: colors.warning[700],
        };
      case 'danger':
        return {
          backgroundColor: colors.danger[100],
          textColor: colors.danger[700],
        };
      case 'info':
        return {
          backgroundColor: colors.blue[100],
          textColor: colors.blue[700],
        };
      default:
        return {
          backgroundColor: colors.gray[100],
          textColor: colors.gray[700],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          fontSize: typography.sizes.xs,
        };
      case 'md':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: typography.sizes.xs,
        };
      case 'lg':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: typography.sizes.sm,
        };
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: typography.sizes.xs,
        };
    }
  };

  const { backgroundColor, textColor } = getVariantStyles();
  const { paddingVertical, paddingHorizontal, fontSize } = getSizeStyles();

  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingVertical,
          paddingHorizontal,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>
        {formatStatus(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: typography.weights.medium,
  },
});

export default StatusBadge;