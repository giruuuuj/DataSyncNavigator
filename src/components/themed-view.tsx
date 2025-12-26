import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({ children, style, lightColor, darkColor }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = lightColor ?? Colors[colorScheme ?? 'light'].background;

  return (
    <View style={[{ backgroundColor }, style]}>
      {children}
    </View>
  );
}
