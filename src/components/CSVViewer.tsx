import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';

interface CSVViewerProps {
  onFileLoaded?: (data: any[], columns: string[]) => void;
}

interface CSVData {
  headers: string[];
  rows: any[][];
  fileName: string;
  fileSize: number;
}

const CSVViewer: React.FC<CSVViewerProps> = ({ onFileLoaded }) => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const rowsPerPage = 20;

  const pickCSVFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const file = result.assets[0];
        await processCSVFile(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick CSV file');
    }
  };

  const processCSVFile = async (file: any) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(file.uri);
      const fileContent = await response.text();
      
      Papa.parse(fileContent, {
        complete: (result) => {
          if (result.data && result.data.length > 0) {
            const headers = Object.keys(result.data[0] as object);
            const rows = result.data.map((row: any) => Object.values(row));
            
            const data: CSVData = {
              headers,
              rows,
              fileName: file.name,
              fileSize: file.size || 0,
            };
            
            setCsvData(data);
            onFileLoaded?.(result.data, headers);
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error: any) => {
          Alert.alert('Parse Error', 'Failed to parse CSV file');
          console.error('CSV parsing error:', error);
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to read CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const sortData = (columnIndex: number) => {
    if (!csvData) return;
    
    const newDirection = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(newDirection);
    
    const sortedRows = [...csvData.rows].sort((a, b) => {
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return newDirection === 'asc' ? comparison : -comparison;
    });
    
    setCsvData({ ...csvData, rows: sortedRows });
  };

  const getSortIcon = (columnIndex: number) => {
    if (sortColumn !== columnIndex) return 'unfold-more';
    return sortDirection === 'asc' ? 'arrow-upward' : 'arrow-downward';
  };

  const getPaginatedRows = () => {
    if (!csvData) return [];
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return csvData.rows.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    if (!csvData) return 0;
    return Math.ceil(csvData.rows.length / rowsPerPage);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Loading CSV file...</Text>
      </View>
    );
  }

  if (!csvData) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="description" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No CSV file loaded</Text>
          <Text style={styles.emptyDescription}>
            Pick a CSV file to view and analyze its contents
          </Text>
          <TouchableOpacity style={styles.loadButton} onPress={pickCSVFile}>
            <MaterialIcons name="folder-open" size={24} color="#fff" />
            <Text style={styles.loadButtonText}>Pick CSV File</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* File Info */}
      <View style={styles.fileInfo}>
        <View style={styles.fileInfoHeader}>
          <MaterialIcons name="description" size={24} color="#4CAF50" />
          <View style={styles.fileInfoDetails}>
            <Text style={styles.fileName}>{csvData.fileName}</Text>
            <Text style={styles.fileMeta}>
              {csvData.headers.length} columns • {csvData.rows.length} rows • {formatFileSize(csvData.fileSize)}
            </Text>
          </View>
          <TouchableOpacity style={styles.reloadButton} onPress={pickCSVFile}>
            <MaterialIcons name="refresh" size={20} color="#FF9800" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.headerRow}>
              {csvData.headers.map((header, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.headerCell, styles.sortableHeader]}
                  onPress={() => sortData(index)}
                >
                  <Text style={styles.headerText}>{header}</Text>
                  <MaterialIcons 
                    name={getSortIcon(index)} 
                    size={16} 
                    color={sortColumn === index ? "#FF9800" : "#666"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Rows */}
            {getPaginatedRows().map((row, rowIndex) => (
              <View key={rowIndex} style={styles.dataRow}>
                {row.map((cell, cellIndex) => (
                  <View key={cellIndex} style={styles.dataCell}>
                    <Text style={styles.cellText} numberOfLines={2}>
                      {cell !== null && cell !== undefined ? cell.toString() : ''}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Pagination */}
      {getTotalPages() > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <MaterialIcons name="chevron-left" size={20} color={currentPage === 1 ? "#ccc" : "#FF9800"} />
          </TouchableOpacity>

          <Text style={styles.paginationText}>
            Page {currentPage} of {getTotalPages()}
          </Text>

          <TouchableOpacity
            style={[styles.paginationButton, currentPage === getTotalPages() && styles.disabledButton]}
            onPress={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
            disabled={currentPage === getTotalPages()}
          >
            <MaterialIcons name="chevron-right" size={20} color={currentPage === getTotalPages() ? "#ccc" : "#FF9800"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loadButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  fileInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fileInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileInfoDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fileMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reloadButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  table: {
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#FF9800',
    backgroundColor: '#fafafa',
  },
  headerCell: {
    padding: 12,
    minWidth: 120,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    justifyContent: 'center',
  },
  sortableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataCell: {
    padding: 12,
    minWidth: 120,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paginationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  disabledButton: {
    backgroundColor: '#f9f9f9',
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default CSVViewer;
