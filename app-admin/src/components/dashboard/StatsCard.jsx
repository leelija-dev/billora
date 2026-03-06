import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // or 'react-native-linear-gradient'
import { theme } from '../../theme';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = theme.colors.primary,
  gradient,
  trend,
  onPress,
  style,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  };

  const getTrendColor = () => {
    if (!trend) return theme.colors.textSecondary;
    return trend > 0 ? theme.colors.success : trend < 0 ? theme.colors.error : theme.colors.textSecondary;
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  // If gradient is provided, render with LinearGradient
  if (gradient) {
    return (
      <CardComponent
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
        style={style}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={[styles.icon, { color: '#FFFFFF' }]}>{icon}</Text>
              </View>
              {trend !== undefined && (
                <View style={styles.trendContainer}>
                  <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
                    {getTrendIcon()}
                  </Text>
                  <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                    {Math.abs(trend)}%
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.value, styles.lightText]}>{value}</Text>
            <Text style={[styles.title, styles.lightSubtext]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, styles.lightSubtext]}>{subtitle}</Text>}
          </View>
        </LinearGradient>
      </CardComponent>
    );
  }

  // Original non-gradient version
  return (
    <CardComponent
      style={[styles.container, { borderLeftColor: color }, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
        {trend !== undefined && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
              {getTrendIcon()}
            </Text>
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  gradientContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendIcon: {
    fontSize: 12,
  },
  trendValue: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  value: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs / 2,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  lightText: {
    color: '#FFFFFF',
  },
  lightSubtext: {
    color: 'rgba(255,255,255,0.9)',
  },
});

export default StatsCard;