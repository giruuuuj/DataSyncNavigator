import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const features = [
    {
      id: 'data-insights',
      title: 'Smart Insights',
      description: 'AI-powered data analysis and predictions',
      iconComponent: 'MaterialIcons',
      iconName: 'analytics',
      color: '#9C27B0',
      screen: 'DataInsights',
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      description: 'Collaborate and share data with teams',
      iconComponent: 'MaterialIcons',
      iconName: 'share',
      color: '#4CAF50',
      screen: 'DataSharing',
    },
    {
      id: 'data-visualization',
      title: 'Data Visualization',
      description: 'Create charts and graphs from your data',
      iconComponent: 'MaterialIcons',
      iconName: 'bar-chart',
      color: '#2196F3',
      screen: 'DataVisualization',
    },
    {
      id: 'format-converter',
      title: 'Format Converter',
      description: 'Convert between CSV, JSON, Excel formats',
      iconComponent: 'FontAwesome5',
      iconName: 'sync-alt',
      color: '#FF9800',
      screen: 'FormatConverter',
    },
    {
      id: 'file-merger',
      title: 'File Merger',
      description: 'Merge multiple data files seamlessly',
      iconComponent: 'FontAwesome5',
      iconName: 'object-group',
      color: '#795548',
      screen: 'FileMerger',
    },
    {
      id: 'data-cleaner',
      title: 'Data Cleaner',
      description: 'Clean and validate your data',
      iconComponent: 'MaterialIcons',
      iconName: 'cleaning-services',
      color: '#9C27B0',
      screen: 'DataCleaner',
    },
    {
      id: 'api-tester',
      title: 'API Tester',
      description: 'Test REST APIs and view responses',
      iconComponent: 'MaterialIcons',
      iconName: 'api',
      color: '#F44336',
      screen: 'ApiTester',
    },
    {
      id: 'sql-playground',
      title: 'SQL Playground',
      description: 'Run SQL queries on your data',
      iconComponent: 'MaterialIcons',
      iconName: 'storage',
      color: '#00BCD4',
      screen: 'SqlPlayground',
    },
  ];

  const handleFeaturePress = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DataSync Navigator</Text>
        <Text style={styles.subtitle}>Your unified data management toolkit</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => handleFeaturePress(feature.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                {feature.iconComponent === 'MaterialIcons' && (
                  <MaterialIcons name={feature.iconName as any} size={32} color="#fff" />
                )}
                {feature.iconComponent === 'FontAwesome5' && (
                  <FontAwesome5 name={feature.iconName as any} size={32} color="#fff" />
                )}
                {feature.iconComponent === 'Ionicons' && (
                  <Ionicons name={feature.iconName as any} size={32} color="#fff" />
                )}
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default HomeScreen;
