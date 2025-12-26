import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// import { HelloWave } from '@/components/hello-wave'; // Temporarily commented out
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();
  const features = [
    {
      id: 'converter',
      title: 'Converter',
      subtitle: 'File Converter',
      icon: 'description' as const,
      color: '#4CAF50',
      screen: 'FormatConverter',
    },
    {
      id: 'visualizer',
      title: 'Visualizer',
      subtitle: 'Data Charts',
      icon: 'bar-chart' as const,
      color: '#2196F3',
      screen: 'DataVisualization',
    },
    {
      id: 'tester',
      title: 'Tester',
      subtitle: 'API Testing',
      icon: 'code' as const,
      color: '#FF9800',
      screen: 'ApiTester',
    },
    {
      id: 'sql',
      title: 'SQL',
      subtitle: 'Playground',
      icon: 'storage' as const,
      color: '#9C27B0',
      screen: 'SqlPlayground',
    },
    {
      id: 'merger',
      title: 'Merger',
      subtitle: 'File Merge',
      icon: 'merge' as const,
      color: '#795548',
      screen: 'FileMerger',
    },
    {
      id: 'cleaner',
      title: 'Cleaner',
      subtitle: 'Data Clean',
      icon: 'cleaning-services' as const,
      color: '#607D8B',
      screen: 'DataCleaner',
    },
  ];

  const recentFiles = [
    {
      id: '1',
      name: 'recent-file.csv',
      type: 'csv',
      icon: 'description',
      size: '2.4 MB',
      modified: '2 hours ago',
    },
    {
      id: '2',
      name: 'chart-sales.png',
      type: 'image',
      icon: 'bar-chart',
      size: '856 KB',
      modified: '1 day ago',
    },
    {
      id: '3',
      name: 'api-response.json',
      type: 'json',
      icon: 'api',
      size: '124 KB',
      modified: '3 days ago',
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv': return 'description' as const;
      case 'json': return 'code' as const;
      case 'image': return 'image' as const;
      default: return 'insert-drive-file' as const;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'csv': return '#4CAF50';
      case 'json': return '#FF9800';
      case 'image': return '#2196F3';
      default: return '#757575';
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('../../assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">DataSync Navigator</ThemedText>
      </ThemedView>

      {/* Feature Grid */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Data Operations</ThemedText>
        <View style={styles.featureGrid}>
          {features.map((feature) => (
            <TouchableOpacity 
              key={feature.id} 
              style={styles.featureCard}
              onPress={() => navigation.navigate(feature.screen as never)}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                <MaterialIcons name={feature.icon} size={28} color="#fff" />
              </View>
              <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
              <ThemedText style={styles.featureSubtitle}>{feature.subtitle}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Recent Files */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Files</ThemedText>
        <View style={styles.recentFilesContainer}>
          {recentFiles.map((file) => (
            <TouchableOpacity key={file.id} style={styles.recentFileItem}>
              <View style={[styles.fileIconContainer, { backgroundColor: getFileColor(file.type) }]}>
                <MaterialIcons name={getFileIcon(file.type)} size={20} color="#fff" />
              </View>
              <View style={styles.fileInfo}>
                <ThemedText style={styles.fileName}>{file.name}</ThemedText>
                <ThemedText style={styles.fileMeta}>{file.size} • {file.modified}</ThemedText>
              </View>
              <MaterialIcons name="more-vert" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialIcons name="upload-file" size={24} color="#FF9800" />
            <ThemedText style={styles.quickActionText}>Upload File</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialIcons name="analytics" size={24} color="#4CAF50" />
            <ThemedText style={styles.quickActionText}>Analyze Data</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialIcons name="share" size={24} color="#2196F3" />
            <ThemedText style={styles.quickActionText}>Share Results</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
  },
  recentFilesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  recentFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  fileMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
