import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);
  const [showSampleData, setShowSampleData] = useState(false);

  const dataOperations = [
    { id: 'upload', label: 'File Upload & Preview', icon: 'upload-file', enabled: true },
    { id: 'conversions', label: 'Quick Conversions', icon: 'sync', enabled: true },
    { id: 'charts', label: 'Basic Charts', icon: 'bar-chart', enabled: true },
    { id: 'testing', label: 'API Testing', icon: 'api', enabled: true },
    { id: 'cleaning', label: 'Data Cleaning', icon: 'cleaning-services', enabled: true },
    { id: 'sql', label: 'SQL Queries', icon: 'storage', enabled: true },
  ];

  const sampleData = [
    { name: 'sales_data.csv', type: 'CSV', size: '2.4 MB', icon: 'description' },
    { name: 'user_analytics.json', type: 'JSON', size: '856 KB', icon: 'api' },
    { name: 'api_examples.yaml', type: 'YAML', size: '124 KB', icon: 'code' },
  ];

  const toggleOperation = (operationId: string) => {
    setSelectedOperations(prev => 
      prev.includes(operationId) 
        ? prev.filter(id => id !== operationId)
        : [...prev, operationId]
    );
  };

  const handleTrySample = () => {
    setShowSampleData(true);
  };

  const handleImportDemo = () => {
    // Handle demo import logic
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>

      {/* Data Operations Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <MaterialIcons name="search" size={24} color="#FF9800" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>Data Operations</ThemedText>
        </ThemedView>
        <View style={styles.divider} />
        
        <View style={styles.operationsList}>
          {dataOperations.map((operation) => (
            <TouchableOpacity 
              key={operation.id} 
              style={styles.operationItem}
              onPress={() => toggleOperation(operation.id)}
            >
              <View style={styles.operationLeft}>
                <View style={styles.checkboxContainer}>
                  <MaterialIcons 
                    name={selectedOperations.includes(operation.id) ? "check-box" : "check-box-outline-blank"} 
                    size={20} 
                    color={selectedOperations.includes(operation.id) ? "#4CAF50" : "#666"} 
                  />
                </View>
                <MaterialIcons name={operation.icon} size={20} color="#666" />
                <ThemedText style={styles.operationLabel}>{operation.label}</ThemedText>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Sample Data Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <MaterialIcons name="dataset" size={24} color="#2196F3" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>Sample Data</ThemedText>
        </ThemedView>
        <View style={styles.divider} />
        
        <View style={styles.sampleDataContainer}>
          {sampleData.map((data, index) => (
            <View key={index} style={styles.sampleDataItem}>
              <MaterialIcons name={data.icon} size={20} color="#4CAF50" />
              <ThemedText style={styles.sampleDataName}>• {data.name}</ThemedText>
              <ThemedText style={styles.sampleDataMeta}>{data.type} • {data.size}</ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Quick Actions Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <MaterialIcons name="bolt" size={24} color="#9C27B0" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        </ThemedView>
        <View style={styles.divider} />
        
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleTrySample}>
            <MaterialIcons name="play-arrow" size={20} color="#fff" />
            <ThemedText style={styles.quickActionText}>Try Sample</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButtonSecondary} onPress={handleImportDemo}>
            <MaterialIcons name="download" size={20} color="#FF9800" />
            <ThemedText style={styles.quickActionTextSecondary}>Import Demo</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Selected Operations Summary */}
      {selectedOperations.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Selected Operations</ThemedText>
          </ThemedView>
          <View style={styles.divider} />
          
          <View style={styles.selectedOperationsContainer}>
            {selectedOperations.map((opId) => {
              const operation = dataOperations.find(op => op.id === opId);
              return (
                <View key={opId} style={styles.selectedOperationChip}>
                  <MaterialIcons name={operation?.icon} size={16} color="#fff" />
                  <ThemedText style={styles.selectedOperationText}>{operation?.label}</ThemedText>
                </View>
              );
            })}
          </View>
          
          <TouchableOpacity style={styles.executeButton}>
            <ThemedText style={styles.executeButtonText}>Execute Selected ({selectedOperations.length})</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  operationsList: {
    gap: 2,
  },
  operationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 2,
  },
  operationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxContainer: {
    marginRight: 4,
  },
  operationLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sampleDataContainer: {
    gap: 8,
  },
  sampleDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
  },
  sampleDataName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  sampleDataMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionButtonSecondary: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  quickActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  quickActionTextSecondary: {
    color: '#FF9800',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedOperationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedOperationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedOperationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  executeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  executeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
