import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const Header = ({
  title,
  leftComponent,
  rightComponent,
  showBackButton = false,
  onBackPress,
  backgroundColor = theme.colors.background,
  textColor = theme.colors.text,
  style,
  titleStyle,
}) => {
  const renderLeftComponent = () => {
    if (leftComponent) {
      return <View style={styles.leftComponent}>{leftComponent}</View>;
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backButtonText, { color: textColor }]}>←</Text>
        </TouchableOpacity>
      );
    }

    return <View style={styles.placeholder} />;
  };

  const renderRightComponent = () => {
    if (rightComponent) {
      return <View style={styles.rightComponent}>{rightComponent}</View>;
    }

    return <View style={styles.placeholder} />;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
        {renderLeftComponent()}
        <Text
          style={[
            styles.title,
            { color: textColor },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {renderRightComponent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 56,
  },
  leftComponent: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  rightComponent: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...theme.typography.h4,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    minWidth: 40,
  },
});

export default Header;
