import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface ThemedTextProps {
  children: React.ReactNode;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  style?: TextStyle;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({ 
  children, 
  type = 'default', 
  style, 
  lightColor, 
  darkColor 
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const color = lightColor ?? Colors[colorScheme ?? 'light'].text;

  const getFontWeight = () => {
    switch (type) {
      case 'title':
        return 'bold';
      case 'defaultSemiBold':
        return '600';
      case 'subtitle':
        return '500';
      default:
        return 'normal';
    }
  };

  const getFontSize = () => {
    switch (type) {
      case 'title':
        return 28;
      case 'subtitle':
        return 20;
      default:
        return 16;
    }
  };

  return (
    <Text
      style={[
        {
          color,
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
