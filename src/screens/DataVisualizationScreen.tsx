import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { ChartData } from '../types';

interface DataVisualizationScreenProps {
  navigation: any;
}

const { width: screenWidth } = Dimensions.get('window');

const DataVisualizationScreen: React.FC<DataVisualizationScreenProps> = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('bar');
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/json'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        await processFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const processFile = async (file: any) => {
    try {
      const response = await fetch(file.uri);
      const fileContent = await response.text();
      
      let parsedData: any[] = [];
      
      if (file.name.endsWith('.csv')) {
        const result = Papa.parse(fileContent, { header: true });
        parsedData = result.data.filter((row: any) => Object.keys(row).length > 0);
      } else if (file.name.endsWith('.json')) {
        parsedData = JSON.parse(fileContent);
      }
      
      setData(parsedData);
      generateChartData(parsedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to process file');
      console.error('Processing error:', error);
    }
  };

  const generateChartData = (data: any[]) => {
    if (data.length === 0) return;
    
    const keys = Object.keys(data[0]);
    const numericKeys = keys.filter(key => 
      data.every(row => !isNaN(Number(row[key])))
    );
    
    if (numericKeys.length === 0) {
      Alert.alert('Error', 'No numeric data found for visualization');
      return;
    }
    
    const labels = data.slice(0, 10).map((_, index) => `Item ${index + 1}`);
    const datasets = numericKeys.slice(0, 3).map((key, index) => ({
      label: key,
      data: data.slice(0, 10).map(row => Number(row[key]) || 0),
      backgroundColor: [['#4CAF50', '#2196F3', '#FF9800'][index]],
      borderColor: [['#388E3C', '#1976D2', '#F57C00'][index]],
    }));
    
    setChartData({ labels, datasets });
  };

  const chartTypes = [
    { key: 'bar', label: 'Bar Chart', iconComponent: 'FontAwesome5', iconName: 'chart-bar' },
    { key: 'line', label: 'Line Chart', iconComponent: 'FontAwesome5', iconName: 'chart-line' },
    { key: 'pie', label: 'Pie Chart', iconComponent: 'FontAwesome5', iconName: 'chart-pie' },
  ];

  const renderChart = () => {
    if (!chartData) return null;

    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
      },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets[0] ? [chartData.datasets[0]] : [],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        );
      case 'line':
        return (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets[0] ? [chartData.datasets[0]] : [],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        );
      case 'pie':
        return (
          <PieChart
            data={chartData.labels.map((label, index) => ({
              name: label,
              population: chartData.datasets[0]?.data[index] || 0,
              color: (chartData.datasets[0]?.backgroundColor[index] as string) || '#4CAF50',
              legendFontColor: '#333',
              legendFontSize: 12,
            }))}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.title}>Data Visualization</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Data File</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
            <MaterialIcons name="upload" size={48} color="#4CAF50" />
            <Text style={styles.filePickerText}>
              {selectedFile ? selectedFile.name : 'Tap to select a file'}
            </Text>
            <Text style={styles.filePickerSubtext}>
              Supports: CSV, JSON files
            </Text>
          </TouchableOpacity>
        </View>

        {data.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chart Type</Text>
              <View style={styles.chartTypeGrid}>
                {chartTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.chartTypeCard,
                      chartType === type.key && styles.chartTypeCardSelected,
                    ]}
                    onPress={() => setChartType(type.key as any)}
                  >
                    {type.iconComponent === 'FontAwesome5' && (
                      <FontAwesome5
                        name={type.iconName as any}
                        size={32}
                        color={chartType === type.key ? '#fff' : '#666'}
                      />
                    )}
                    <Text
                      style={[
                        styles.chartTypeLabel,
                        chartType === type.key && styles.chartTypeLabelSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chart Preview</Text>
              {chartData && renderChart()}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Summary</Text>
              <View style={styles.dataSummary}>
                <Text style={styles.summaryText}>Total Rows: {data.length}</Text>
                <Text style={styles.summaryText}>Columns: {Object.keys(data[0] || {}).length}</Text>
                <Text style={styles.summaryText}>Numeric Columns: {
                  Object.keys(data[0] || {}).filter(key => 
                    data.every(row => !isNaN(Number(row[key])))
                  ).length
                }</Text>
              </View>
            </View>
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  filePicker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  filePickerSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  chartTypeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartTypeCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  chartTypeCardSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  chartTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  chartTypeLabelSelected: {
    color: '#fff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  dataSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
});

export default DataVisualizationScreen;
