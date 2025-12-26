import React from 'react';
import { View, StyleSheet, ScrollView, ScrollViewProps } from 'react-native';
import { useColorScheme } from 'react-native';

interface ParallaxScrollViewProps extends ScrollViewProps {
  headerBackgroundColor?: { light: string; dark: string };
  headerImage?: React.ReactNode;
  children: React.ReactNode;
}

export function ParallaxScrollView({ 
  headerBackgroundColor = { light: '#D0D0D0', dark: '#353636' },
  headerImage,
  children,
  style,
  ...scrollViewProps
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = headerBackgroundColor[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, style]} {...scrollViewProps}>
      <View style={[styles.header, { backgroundColor }]}>
        {headerImage}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
