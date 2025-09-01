import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colors, typography } = useTheme();
  
  // Animation values
  const strokeDashoffset1 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset2 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset3 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset4 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset5 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset6 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset7 = useRef(new Animated.Value(1)).current;
  const strokeDashoffset8 = useRef(new Animated.Value(1)).current;
  
  const fillOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const strokeAnimations = [
      strokeDashoffset1, strokeDashoffset2, strokeDashoffset3, strokeDashoffset4,
      strokeDashoffset5, strokeDashoffset6, strokeDashoffset7, strokeDashoffset8
    ];

    // Start the animation sequence
    const timeline = Animated.sequence([
      // Step 1: Draw paths one by one
      Animated.stagger(200, strokeAnimations.map(offset =>
        Animated.timing(offset, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        })
      )),
      
      // Step 2: Fill the petals
      Animated.timing(fillOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      
      // Step 3: Fade in "Prism"
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // Step 4: Fade in subtitle
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // Step 5: Wait a moment, then fade out to empty state
      Animated.delay(1000),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]);

    timeline.start(() => {
      onComplete();
    });

    return () => timeline.stop();
  }, []);

  const pathData = [
    "M251.36 251C213.207 167.667 159.792 1 251.36 1C342.929 1 289.514 167.667 251.36 251Z",
    "M251.36 251C213.207 334.333 159.792 501 251.36 501C342.929 501 289.514 334.333 251.36 251Z",
    "M247.994 251.175C165.663 212.557 1 158.492 0.999998 251.175C0.999994 343.858 165.663 289.793 247.994 251.175Z",
    "M254.006 251.175C336.337 212.557 501 158.492 501 251.175C501 343.858 336.337 289.793 254.006 251.175Z",
    "M266.671 238.354C297.91 152.121 376.574 -3.95989 441.322 61.5768C506.071 127.114 351.867 206.735 266.671 238.354Z",
    "M266.671 268.893C351.867 300.512 506.071 380.133 441.323 445.67C376.574 511.206 297.91 355.125 266.671 268.893Z",
    "M236.403 238.963C205.165 152.73 126.501 -3.35051 61.7518 62.1862C-2.99689 127.723 151.207 207.344 236.403 238.963Z",
    "M236.498 268.893C151.303 300.512 -2.90141 380.133 61.8473 445.67C126.596 511.206 205.26 355.125 236.498 268.893Z"
  ];

  const strokeOffsets = [
    strokeDashoffset1, strokeDashoffset2, strokeDashoffset3, strokeDashoffset4,
    strokeDashoffset5, strokeDashoffset6, strokeDashoffset7, strokeDashoffset8
  ];

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor: colors.background,
      opacity: screenOpacity 
    }]}>
      <View style={styles.logoContainer}>
        {/* Animated Flower Logo */}
        <Svg width={120} height={120} viewBox="0 0 502 502">
          {pathData.map((d, index) => (
            <AnimatedPath
              key={index}
              d={d}
              stroke={colors.text.primary}
              strokeWidth="8"
              fill={fillOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: ['transparent', colors.text.primary]
              })}
              strokeDasharray="1000"
              strokeDashoffset={strokeOffsets[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>

      {/* Title */}
      <Animated.Text style={[
        styles.title, 
        {
          fontFamily: typography.fonts.regular,
          color: colors.text.primary,
          opacity: titleOpacity
        }
      ]}>
        Prism
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text style={[
        styles.subtitle,
        {
          fontFamily: typography.fonts.regular,
          color: colors.text.secondary,
          opacity: subtitleOpacity
        }
      ]}>
        It all starts with a quick thought
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
});
