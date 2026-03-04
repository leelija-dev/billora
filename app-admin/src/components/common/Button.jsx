import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = [styles.button];
    
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostButton);
        break;
      default:
        baseStyles.push(styles.primaryButton);
    }
    
    switch (size) {
      case 'small':
        baseStyles.push(styles.smallButton);
        break;
      case 'medium':
        baseStyles.push(styles.mediumButton);
        break;
      case 'large':
        baseStyles.push(styles.largeButton);
        break;
      default:
        baseStyles.push(styles.mediumButton);
    }
    
    if (disabled) {
      baseStyles.push(styles.disabledButton);
    }
    
    return baseStyles;
  };

  const getTextStyles = () => {
    const baseStyles = [styles.text];
    
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyles.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostText);
        break;
      default:
        baseStyles.push(styles.primaryText);
    }
    
    switch (size) {
      case 'small':
        baseStyles.push(styles.smallText);
        break;
      case 'medium':
        baseStyles.push(styles.mediumText);
        break;
      case 'large':
        baseStyles.push(styles.largeText);
        break;
      default:
        baseStyles.push(styles.mediumText);
    }
    
    return baseStyles;
  };

  const renderButtonContent = () => {
    if (loading) {
      return (
        <View style={[styles.spinner, { borderColor: variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#fff' }]}>
          <View style={[styles.spinnerInner, { backgroundColor: variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#fff' }]} />
        </View>
      );
    }

    return (
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      </View>
    );
  };

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        style={[getButtonStyles(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        {renderButtonContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },
  mediumButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 52,
  },
  disabledButton: {
    opacity: 0.5,
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  spinnerInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.xs,
  },
  text: {
    ...theme.typography.button,
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button;
