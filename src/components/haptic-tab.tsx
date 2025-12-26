import React from 'react';
import { Pressable, Platform, View } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticTabProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export function HapticTab({ children, onPress, style }: HapticTabProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <Pressable
      style={style}
      onPress={handlePress}
    >
      {children}
    </Pressable>
  );
}
