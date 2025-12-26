import React from 'react';
import { Text } from 'react-native';
import { useSegments } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  const segments = useSegments();
  
  // Map SF Symbol names to FontAwesome names
  const iconMap: Record<string, string> = {
    'house.fill': 'home',
    'paperplane.fill': 'paper-plane',
    'magnifyingglass': 'search',
    'plus': 'plus',
    'heart.fill': 'heart',
    'person.fill': 'user',
  };

  const iconName = iconMap[name] || 'question';

  return (
    <FontAwesome 
      name={iconName as any} 
      size={size} 
      color={color} 
      style={style}
    />
  );
}
