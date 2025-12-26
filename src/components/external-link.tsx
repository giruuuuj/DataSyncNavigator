import React from 'react';
import { Linking, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  const colorScheme = useColorScheme();
  
  const handlePress = async () => {
    try {
      await Linking.openURL(href);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.link, { color: Colors[colorScheme ?? 'light'].tint }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});
