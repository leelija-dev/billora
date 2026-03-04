// components/common/Input.js (Enhanced Version)
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Input = ({
  // Core props
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,

  // Input configuration
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  editable = true,

  // Icons
  leftIcon,
  rightIcon,
  onRightIconPress,

  // Status
  error,
  success,
  warning,
  helper,
  loading = false,

  // Validation
  required = false,
  maxLength,
  minLength,

  // Styling
  size = "md", // 'sm', 'md', 'lg'
  variant = "outlined", // 'outlined', 'filled', 'underlined'
  rounded = "lg", // 'none', 'sm', 'md', 'lg', 'full'

  // Additional
  disabled = false,
  returnKeyType = "done",
  onSubmitEditing,
  ref,

  // Custom classes
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",

  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const inputRef = useRef(null);

  const sizeStyles = {
    sm: {
      container: "px-3 py-2",
      text: "text-sm",
      icon: 18,
    },
    md: {
      container: "px-4 py-3",
      text: "text-base",
      icon: 20,
    },
    lg: {
      container: "px-4 py-4",
      text: "text-lg",
      icon: 22,
    },
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  const variantStyles = {
    outlined: {
      container: `border ${getBorderColor()}`,
      background: "bg-white",
    },
    filled: {
      container: "border-0",
      background: "bg-gray-100",
    },
    underlined: {
      container: "border-0 border-b rounded-none",
      background: "bg-transparent",
    },
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  const blur = () => {
    inputRef.current?.blur();
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);

  function getBorderColor() {
    if (error) return "border-red-500";
    if (warning) return "border-yellow-500";
    if (success) return "border-green-500";
    if (isFocused) return "border-blue-500";
    return "border-gray-200";
  }

  function getIconColor() {
    if (error) return "#ef4444";
    if (warning) return "#f97316";
    if (success) return "#22c55e";
    if (isFocused) return "#3b82f6";
    return "#9ca3af";
  }

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <View className="mr-3">
        {typeof leftIcon === "string" ? (
          <Icon
            name={leftIcon}
            size={sizeStyles[size].icon}
            color={getIconColor()}
          />
        ) : (
          leftIcon
        )}
      </View>
    );
  };

  const renderRightIcon = () => {
    if (loading) {
      return (
        <View className="ml-3">
          <ActivityIndicator size="small" color={getIconColor()} />
        </View>
      );
    }

    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={toggleSecureEntry} className="ml-3">
          <Icon
            name={isSecure ? "eye-off" : "eye"}
            size={sizeStyles[size].icon}
            color={getIconColor()}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          className="ml-3"
          disabled={!onRightIconPress}
        >
          {typeof rightIcon === "string" ? (
            <Icon
              name={rightIcon}
              size={sizeStyles[size].icon}
              color={getIconColor()}
            />
          ) : (
            rightIcon
          )}
        </TouchableOpacity>
      );
    }

    // Show status icons
    if (success && !rightIcon) {
      return (
        <View className="ml-3">
          <Icon
            name="check-circle"
            size={sizeStyles[size].icon}
            color="#22c55e"
          />
        </View>
      );
    }

    if (error && !rightIcon) {
      return (
        <View className="ml-3">
          <Icon
            name="alert-circle"
            size={sizeStyles[size].icon}
            color="#ef4444"
          />
        </View>
      );
    }

    return null;
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <TouchableOpacity onPress={focus} activeOpacity={0.7}>
        <View className="flex-row items-center mb-2">
          <Text
            className={`text-sm font-medium text-gray-700 ${labelClassName}`}
          >
            {label}
          </Text>
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHelper = () => {
    if (error) {
      return (
        <View className="flex-row items-center mt-2">
          <Icon name="alert-circle" size={14} color="#ef4444" />
          <Text className={`text-xs text-red-500 ml-1 ${errorClassName}`}>
            {error}
          </Text>
        </View>
      );
    }

    if (warning) {
      return (
        <View className="flex-row items-center mt-2">
          <Icon name="alert" size={14} color="#f97316" />
          <Text className="text-xs text-yellow-600 ml-1">{warning}</Text>
        </View>
      );
    }

    if (helper) {
      return (
        <View className="flex-row items-center mt-2">
          <Icon name="information" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-500 ml-1">{helper}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Animated.View
      className={`mb-4 ${containerClassName}`}
      style={{
        transform: [{ translateX: shakeAnimation }],
      }}
    >
      {renderLabel()}

      <TouchableOpacity
        activeOpacity={1}
        onPress={focus}
        disabled={disabled || !editable}
      >
        <View
          className={`
            flex-row items-center
            ${variantStyles[variant].container}
            ${variantStyles[variant].background}
            ${roundedStyles[rounded]}
            ${sizeStyles[size].container}
            ${disabled ? "opacity-60" : ""}
            ${inputClassName}
          `}
        >
          {renderLeftIcon()}

          <TextInput
            ref={inputRef}
            className={`
              flex-1
              ${sizeStyles[size].text}
              ${disabled ? "text-gray-400" : "text-gray-800"}
              ${multiline ? "text-top" : ""}
            `}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            secureTextEntry={isSecure}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            editable={!disabled && editable}
            maxLength={maxLength}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            {...props}
          />

          {renderRightIcon()}
        </View>
      </TouchableOpacity>

      {renderHelper()}

      {maxLength > 0 && (
        <View className="flex-row justify-end mt-1">
          <Text className="text-xs text-gray-400">
            {value?.length || 0}/{maxLength}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default Input;
