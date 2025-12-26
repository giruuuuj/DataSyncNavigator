import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';

const { width: screenWidth } = Dimensions.get('window');

interface DataInsightsScreenProps {
  navigation: any;
}

interface DataInsight {
  id: string;
  title: string;
  type: 'statistic' | 'pattern' | 'anomaly' | 'prediction';
  value: string | number;
  description: string;
  confidence: number;
  timestamp: Date;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
  }>;
}

const DataInsightsScreen: React.FC<DataInsightsScreenProps> = ({ navigation }) => {
  const [insights, setInsights] = useState<DataInsight[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsightType, setSelectedInsightType] = useState<string>('all');

  useEffect(() => {
    generateSampleInsights();
  }, []);

  const generateSampleInsights = () => {
    const sampleInsights: DataInsight[] = [
      {
        id: '1',
        title: 'Revenue Growth Trend',
        type: 'pattern',
        value: '+23.5%',
        description: 'Revenue shows consistent upward trend over last 6 months',
        confidence: 0.92,
        timestamp: new Date(),
      },
      {
        id: '2',
        title: 'Data Quality Score',
        type: 'statistic',
        value: 94.2,
        description: 'Overall data quality is excellent with minimal missing values',
        confidence: 0.88,
        timestamp: new Date(),
      },
      {
        id: '3',
        title: 'Anomalous Sales Spike',
        type: 'anomaly',
        value: 'Day 15',
        description: 'Unusual spike detected in sales data - investigate potential data entry error',
        confidence: 0.76,
        timestamp: new Date(),
      },
      {
        id: '4',
        title: 'Q1 Revenue Prediction',
        type: 'prediction',
        value: '$125,000',
        description: 'Based on historical trends, Q1 revenue projected to increase by 15%',
        confidence: 0.81,
        timestamp: new Date(),
      },
    ];

    setInsights(sampleInsights);
    generateSampleChartData();
  };

  const generateSampleChartData = () => {
    const sampleData: ChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [65000, 72000, 68000, 85000, 92000, 98000],
          color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
        },
      ],
    };
    setChartData(sampleData);
  };

  const analyzeData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/json'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const file = result.assets[0];
        await processAndAnalyzeData(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick data file for analysis');
    }
  };

  const processAndAnalyzeData = async (file: any) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(file.uri);
      const fileContent = await response.text();
      
      let data: any[] = [];
      
      if (file.name.endsWith('.csv')) {
        const result = Papa.parse(fileContent, { header: true });
        data = result.data.filter((row: any) => Object.keys(row).length > 0);
      } else if (file.name.endsWith('.json')) {
        data = JSON.parse(fileContent);
      }

      setRawData(data);
      await performAdvancedAnalysis(data);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performAdvancedAnalysis = async (data: any[]) => {
    const newInsights: DataInsight[] = [];

    // Statistical Analysis
    if (data.length > 0) {
      const numericColumns = Object.keys(data[0]).filter(key => 
        typeof data[0][key] === 'number' || !isNaN(parseFloat(data[0][key]))
      );

      numericColumns.forEach(column => {
        const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
        if (values.length > 0) {
          const mean = values.reduce((a, b) => a + b, 0) / values.length;
          const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
          
          newInsights.push({
            id: `stat-${column}`,
            title: `${column} Statistics`,
            type: 'statistic',
            value: mean.toFixed(2),
            description: `Mean: ${mean.toFixed(2)}, Std Dev: ${stdDev.toFixed(2)}`,
            confidence: 0.95,
            timestamp: new Date(),
          });
        }
      });

      // Pattern Detection
      if (data.length > 10) {
        const trend = detectTrend(data, numericColumns[0]);
        if (trend) {
          newInsights.push({
            id: 'pattern-trend',
            title: 'Trend Analysis',
            type: 'pattern',
            value: trend.direction,
            description: trend.description,
            confidence: trend.confidence,
            timestamp: new Date(),
          });
        }
      }

      // Anomaly Detection
      const anomalies = detectAnomalies(data, numericColumns[0]);
      anomalies.forEach(anomaly => {
        newInsights.push({
          id: `anomaly-${anomaly.index}`,
          title: 'Anomaly Detected',
          type: 'anomaly',
          value: `Row ${anomaly.index}`,
          description: anomaly.description,
          confidence: 0.75,
          timestamp: new Date(),
        });
      });
    }

    setInsights(prev => [...newInsights, ...prev]);
    Alert.alert('Analysis Complete', `Generated ${newInsights.length} new insights`);
  };

  const detectTrend = (data: any[], column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    if (values.length < 5) return null;

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondMean - firstMean) / firstMean) * 100;
    
    if (Math.abs(change) < 5) return null;
    
    return {
      direction: change > 0 ? 'Upward' : 'Downward',
      description: `${column} shows ${change > 0 ? 'increasing' : 'decreasing'} trend (${Math.abs(change).toFixed(1)}% change)`,
      confidence: Math.min(0.9, Math.abs(change) / 20),
    };
  };

  const detectAnomalies = (data: any[], column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    if (values.length < 10) return [];

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
    const threshold = 2 * stdDev;

    const anomalies: Array<{index: number, description: string}> = [];
    values.forEach((value, index) => {
      if (Math.abs(value - mean) > threshold) {
        anomalies.push({
          index,
          description: `Value ${value.toFixed(2)} is ${Math.abs((value - mean) / stdDev).toFixed(1)} standard deviations from mean`,
        });
      }
    });

    return anomalies.slice(0, 5); // Limit to top 5 anomalies
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'statistic': return 'bar-chart';
      case 'pattern': return 'trending-up';
      case 'anomaly': return 'warning';
      case 'prediction': return 'timeline';
      default: return 'analytics';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'statistic': return '#2196F3';
      case 'pattern': return '#4CAF50';
      case 'anomaly': return '#FF5722';
      case 'prediction': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FF9800';
    return '#F44336';
  };

  const filteredInsights = selectedInsightType === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedInsightType);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#FF9800',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Smart Data Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Analysis</Text>
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeData} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialIcons name="analytics" size={24} color="#fff" />
            )}
            <Text style={styles.analyzeButtonText}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Data File'}
            </Text>
          </TouchableOpacity>
        </View>

        {chartData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trend Visualization</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data Insights</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {['all', 'statistic', 'pattern', 'anomaly', 'prediction'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      selectedInsightType === type && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedInsightType(type)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedInsightType === type && styles.filterChipTextSelected,
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {filteredInsights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIconContainer}>
                  <MaterialIcons 
                    name={getInsightIcon(insight.type)} 
                    size={24} 
                    color={getInsightColor(insight.type)} 
                  />
                </View>
                <View style={styles.insightInfo}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightValue}>{insight.value}</Text>
                </View>
                <View style={styles.confidenceBadge}>
                  <Text style={[
                    styles.confidenceText,
                    { color: getConfidenceColor(insight.confidence) }
                  ]}>
                    {Math.round(insight.confidence * 100)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              <Text style={styles.insightTimestamp}>
                {insight.timestamp.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <MaterialIcons name="assessment" size={32} color="#2196F3" />
              <Text style={styles.summaryValue}>{insights.length}</Text>
              <Text style={styles.summaryLabel}>Total Insights</Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialIcons name="trending-up" size={32} color="#4CAF50" />
              <Text style={styles.summaryValue}>
                {insights.filter(i => i.type === 'pattern').length}
              </Text>
              <Text style={styles.summaryLabel}>Patterns Found</Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialIcons name="warning" size={32} color="#FF5722" />
              <Text style={styles.summaryValue}>
                {insights.filter(i => i.type === 'anomaly').length}
              </Text>
              <Text style={styles.summaryLabel}>Anomalies</Text>
            </View>
            <View style={styles.summaryCard}>
              <MaterialIcons name="timeline" size={32} color="#9C27B0" />
              <Text style={styles.summaryValue}>
                {insights.filter(i => i.type === 'prediction').length}
              </Text>
              <Text style={styles.summaryLabel}>Predictions</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FF9800',
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipSelected: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  confidenceBadge: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  insightTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default DataInsightsScreen;
