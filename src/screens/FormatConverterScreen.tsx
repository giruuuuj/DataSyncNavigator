import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FormatConverterScreenProps {
  navigation: any;
}

const FormatConverterScreen: React.FC<FormatConverterScreenProps> = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [targetFormat, setTargetFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isConverting, setIsConverting] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const convertFile = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    setIsConverting(true);

    try {
      const response = await fetch(selectedFile.uri);
      const fileContent = await response.text();
      
      let convertedData: any;
      let fileName: string;

      if (targetFormat === 'json') {
        if (selectedFile.name.endsWith('.csv')) {
          const parsed = Papa.parse(fileContent, { header: true });
          convertedData = JSON.stringify(parsed.data, null, 2);
          fileName = selectedFile.name.replace('.csv', '.json');
        } else if (selectedFile.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          convertedData = JSON.stringify(jsonData, null, 2);
          fileName = selectedFile.name.replace('.xlsx', '.json');
        }
      } else if (targetFormat === 'csv') {
        if (selectedFile.name.endsWith('.json')) {
          const jsonData = JSON.parse(fileContent);
          convertedData = Papa.unparse(jsonData);
          fileName = selectedFile.name.replace('.json', '.csv');
        } else if (selectedFile.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const csvData = XLSX.utils.sheet_to_csv(worksheet);
          convertedData = csvData;
          fileName = selectedFile.name.replace('.xlsx', '.csv');
        }
      } else if (targetFormat === 'xlsx') {
        let dataForExcel: any[];
        
        if (selectedFile.name.endsWith('.csv')) {
          const parsed = Papa.parse(fileContent, { header: true });
          dataForExcel = parsed.data;
        } else if (selectedFile.name.endsWith('.json')) {
          dataForExcel = JSON.parse(fileContent);
        } else {
          dataForExcel = [];
        }
        
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        convertedData = excelBuffer;
        fileName = selectedFile.name.replace(/\.(csv|json)$/, '.xlsx');
      }

      Alert.alert(
        'Conversion Complete',
        `File converted to ${targetFormat.toUpperCase()} format`,
        [
          { text: 'OK', onPress: () => console.log('Converted data:', convertedData) }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to convert file');
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const formats = [
    { key: 'csv', label: 'CSV', iconComponent: 'FontAwesome5', iconName: 'file-csv' },
    { key: 'json', label: 'JSON', iconComponent: 'FontAwesome5', iconName: 'file-code' },
    { key: 'xlsx', label: 'Excel', iconComponent: 'FontAwesome5', iconName: 'file-excel' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Format Converter</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select File</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
            <MaterialIcons name="upload" size={48} color="#4CAF50" />
            <Text style={styles.filePickerText}>
              {selectedFile ? selectedFile.name : 'Tap to select a file'}
            </Text>
            <Text style={styles.filePickerSubtext}>
              Supports: CSV, JSON, Excel files
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Format</Text>
          <View style={styles.formatGrid}>
            {formats.map((format) => (
              <TouchableOpacity
                key={format.key}
                style={[
                  styles.formatCard,
                  targetFormat === format.key && styles.formatCardSelected,
                ]}
                onPress={() => setTargetFormat(format.key as any)}
              >
                {format.iconComponent === 'FontAwesome5' && (
                  <FontAwesome5
                    name={format.iconName as any}
                    size={32}
                    color={targetFormat === format.key ? '#fff' : '#666'}
                  />
                )}
                <Text
                  style={[
                    styles.formatLabel,
                    targetFormat === format.key && styles.formatLabelSelected,
                  ]}
                >
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.convertButton, !selectedFile && styles.convertButtonDisabled]}
          onPress={convertFile}
          disabled={!selectedFile || isConverting}
        >
          {isConverting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.convertButtonText}>Convert File</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: '#2196F3',
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
  formatGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  formatCardSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  formatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  formatLabelSelected: {
    color: '#fff',
  },
  convertButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  convertButtonDisabled: {
    backgroundColor: '#ccc',
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FormatConverterScreen;
