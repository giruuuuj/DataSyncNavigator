import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  createdAt: Date;
}

interface ApiTesterScreenProps {
  navigation: any;
}

const ApiTesterScreen: React.FC<ApiTesterScreenProps> = ({ navigation }) => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([]);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

  const loadSavedRequests = async () => {
    try {
      const stored = await AsyncStorage.getItem('api_requests');
      if (stored) {
        setSavedRequests(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  React.useEffect(() => {
    loadSavedRequests();
  }, []);

  const sendRequest = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const parsedBody = body ? JSON.parse(body) : undefined;

      const config: any = {
        method,
        url: url.trim(),
        headers: parsedHeaders,
        timeout: 10000,
      };

      if (method !== 'GET' && parsedBody) {
        config.data = parsedBody;
      }

      const startTime = Date.now();
      const result = await axios(config);
      const endTime = Date.now();

      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        data: result.data,
        responseTime: endTime - startTime,
      });
    } catch (error: any) {
      setResponse({
        status: error.response?.status || 0,
        statusText: error.message,
        headers: error.response?.headers || {},
        data: error.response?.data || error.message,
        responseTime: 0,
        error: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRequest = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    try {
      const newRequest: ApiRequest = {
        id: Date.now().toString(),
        name: `${method} ${new URL(url).pathname}`,
        method,
        url: url.trim(),
        headers: headers ? JSON.parse(headers) : {},
        body: body ? JSON.parse(body) : undefined,
        createdAt: new Date(),
      };

      const updatedRequests = [...savedRequests, newRequest];
      setSavedRequests(updatedRequests);
      await AsyncStorage.setItem('api_requests', JSON.stringify(updatedRequests));
      Alert.alert('Success', 'Request saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save request');
    }
  };

  const loadRequest = (request: ApiRequest) => {
    setMethod(request.method);
    setUrl(request.url);
    setHeaders(JSON.stringify(request.headers || {}, null, 2));
    setBody(request.body ? JSON.stringify(request.body, null, 2) : '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>API Tester</Text>
        <TouchableOpacity onPress={saveRequest}>
          <MaterialIcons name="save" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HTTP Method</Text>
            <View style={styles.methodGrid}>
              {methods.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.methodCard,
                    method === m && styles.methodCardSelected,
                  ]}
                  onPress={() => setMethod(m)}
                >
                  <Text
                    style={[
                      styles.methodLabel,
                      method === m && styles.methodLabelSelected,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>URL</Text>
            <TextInput
              style={styles.urlInput}
              value={url}
              onChangeText={setUrl}
              placeholder="https://api.example.com/endpoint"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Headers (JSON)</Text>
            <TextInput
              style={[styles.textInput, styles.jsonInput]}
              value={headers}
              onChangeText={setHeaders}
              placeholder='{"Content-Type": "application/json"}'
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
            />
          </View>

          {method !== 'GET' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Body (JSON)</Text>
              <TextInput
                style={[styles.textInput, styles.jsonInput]}
                value={body}
                onChangeText={setBody}
                placeholder='{"key": "value"}'
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={sendRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send Request</Text>
            )}
          </TouchableOpacity>

          {response && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Response</Text>
              <View style={styles.responseCard}>
                <View style={styles.responseHeader}>
                  <Text style={styles.responseStatus}>
                    Status: {response.status} {response.statusText}
                  </Text>
                  <Text style={styles.responseTime}>
                    {response.responseTime}ms
                  </Text>
                </View>
                <Text style={styles.responseData}>
                  {JSON.stringify(response.data, null, 2)}
                </Text>
              </View>
            </View>
          )}

          {savedRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Requests</Text>
              {savedRequests.map((request) => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.savedRequestCard}
                  onPress={() => loadRequest(request)}
                >
                  <Text style={styles.savedRequestName}>{request.name}</Text>
                  <Text style={styles.savedRequestUrl}>{request.url}</Text>
                  <Text style={styles.savedRequestMethod}>{request.method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: '#F44336',
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
  methodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  methodCardSelected: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  methodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  methodLabelSelected: {
    color: '#fff',
  },
  urlInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  jsonInput: {
    height: 120,
    fontFamily: 'monospace',
  },
  sendButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  responseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  responseStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  responseTime: {
    fontSize: 12,
    color: '#666',
  },
  responseData: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  savedRequestCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  savedRequestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  savedRequestUrl: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  savedRequestMethod: {
    fontSize: 10,
    color: '#F44336',
    fontWeight: '600',
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default ApiTesterScreen;
