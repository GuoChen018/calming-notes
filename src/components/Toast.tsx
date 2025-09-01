import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ToastProps {
  visible: boolean;
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  onDismiss?: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

export default function Toast({ 
  visible, 
  message, 
  actionText = 'Undo', 
  onActionPress,
  onDismiss,
  duration = 8000 
}: ToastProps) {
  const { colors, typography } = useTheme();
  const slideAnim = useRef(new Animated.Value(100)).current;
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Slide up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Auto dismiss after duration
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    } else {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, slideAnim, duration]);

  const handleDismiss = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onDismiss?.();
  };

  const handleActionPress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onActionPress?.();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.text.primary,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <Text style={[
        styles.message,
        {
          color: colors.background,
          fontFamily: typography.fonts.regular,
        }
      ]}>
        {message}
      </Text>
      
      {onActionPress && (
        <TouchableOpacity onPress={handleActionPress} style={styles.actionButton}>
          <Text style={[
            styles.actionText,
            {
              color: colors.accent.primary,
              fontFamily: typography.fonts.regular,
            }
          ]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    flex: 1,
    fontSize: 16,
    marginRight: 16,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
