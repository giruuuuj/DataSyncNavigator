import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SqlPlaygroundScreenProps {
  navigation: any;
}

const SqlPlaygroundScreen: React.FC<SqlPlaygroundScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>SQL Playground</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          SQL Playground functionality coming soon...
        </Text>
        <Text style={styles.placeholderSubtext}>
          Features will include:
        </Text>
        <Text style={styles.featureText}>• SQL query editor</Text>
        <Text style={styles.featureText}>• Query execution on CSV/JSON data</Text>
        <Text style={styles.featureText}>• Query history and favorites</Text>
        <Text style={styles.featureText}>• Export query results</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#00BCD4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default SqlPlaygroundScreen;
