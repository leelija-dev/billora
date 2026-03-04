import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon,
  onPress,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary[600],
          borderColor: colors.primary[600],
        };
      case 'secondary':
        return {
          backgroundColor: colors.gray[200],
          borderColor: colors.gray[300],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.gray[300],
          borderWidth: 2,
        };
      case 'danger':
        return {
          backgroundColor: colors.danger[600],
          borderColor: colors.danger[600],
        };
      case 'success':
        return {
          backgroundColor: colors.success[600],
          borderColor: colors.success[600],
        };
      default:
        return {
          backgroundColor: colors.primary[600],
          borderColor: colors.primary[600],
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        return colors.white;
      case 'secondary':
        return colors.gray[900];
      case 'outline':
        return colors.gray[700];
      default:
        return colors.white;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        };
      case 'md':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        };
      case 'lg':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        };
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return typography.sizes.xs;
      case 'md':
        return typography.sizes.sm;
      case 'lg':
        return typography.sizes.md;
      default:
        return typography.sizes.sm;
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.gray[700] : colors.white}
        />
      ) : (
        <View style={styles.content}>
          {Icon && (
            <Icon
              width={getTextSize() + 2}
              height={getTextSize() + 2}
              style={[styles.icon, children ? styles.iconWithText : null]}
              color={getTextColor()}
            />
          )}
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.text,
                { color: getTextColor(), fontSize: getTextSize() },
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 0,
  },
  iconWithText: {
    marginRight: spacing.xs,
  },
  text: {
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
});

export default Button;