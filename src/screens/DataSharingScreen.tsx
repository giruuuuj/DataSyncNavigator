import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

interface DataSharingScreenProps {
  navigation: any;
}

interface SharedItem {
  id: string;
  name: string;
  type: 'file' | 'chart' | 'analysis';
  data: any;
  sharedWith: string[];
  permissions: 'view' | 'edit' | 'comment';
  createdAt: Date;
  size?: number;
}

const DataSharingScreen: React.FC<DataSharingScreenProps> = ({ navigation }) => {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([
    {
      id: '1',
      name: 'Sales Data Q1 2024',
      type: 'file',
      data: { rows: 1500, columns: 12 },
      sharedWith: ['john@example.com', 'sarah@example.com'],
      permissions: 'edit',
      createdAt: new Date('2024-01-15'),
      size: 245760,
    },
    {
      id: '2',
      name: 'Revenue Analysis Chart',
      type: 'chart',
      data: { chartType: 'line', dataPoints: 30 },
      sharedWith: ['team@company.com'],
      permissions: 'view',
      createdAt: new Date('2024-01-20'),
    },
  ]);

  const [shareEmail, setShareEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const pickFileToShare = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const file = result.assets[0];
        await shareFile(file);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file for sharing');
    }
  };

  const shareFile = async (file: any) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      
      const newSharedItem: SharedItem = {
        id: Date.now().toString(),
        name: file.name,
        type: 'file',
        data: { uri: file.uri, mimeType: file.mimeType },
        sharedWith: [],
        permissions: 'view',
        createdAt: new Date(),
        size: fileInfo.size || 0,
      };

      setSharedItems(prev => [newSharedItem, ...prev]);
      Alert.alert('Success', 'File added to shared items');
    } catch (error) {
      Alert.alert('Error', 'Failed to share file');
    }
  };

  const shareWithCollaborator = () => {
    if (!selectedItem || !shareEmail) {
      Alert.alert('Error', 'Please select an item and enter email');
      return;
    }

    if (!shareEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSharing(true);

    setTimeout(() => {
      setSharedItems(prev => 
        prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, sharedWith: [...item.sharedWith, shareEmail] }
            : item
        )
      );

      Alert.alert('Success', `Data shared with ${shareEmail}`);
      setShareEmail('');
      setSelectedItem(null);
      setIsSharing(false);
    }, 1000);
  };

  const shareViaNative = async (item: SharedItem) => {
    try {
      const shareContent = {
        message: `Check out this data: ${item.name}\nType: ${item.type}\nShared: ${item.createdAt.toLocaleDateString()}`,
        url: item.data.uri || undefined,
      };

      await Share.share(shareContent);
    } catch (error) {
      Alert.alert('Error', 'Failed to share via native sharing');
    }
  };

  const updatePermissions = (itemId: string, permissions: 'view' | 'edit' | 'comment') => {
    setSharedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, permissions } : item
      )
    );
  };

  const removeSharedItem = (itemId: string) => {
    Alert.alert(
      'Remove Shared Item',
      'Are you sure you want to remove this shared item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setSharedItems(prev => prev.filter(item => item.id !== itemId))
        },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return 'description';
      case 'chart': return 'insert-chart';
      case 'analysis': return 'analytics';
      default: return 'folder';
    }
  };

  const getPermissionColor = (permissions: string) => {
    switch (permissions) {
      case 'edit': return '#4CAF50';
      case 'comment': return '#FF9800';
      case 'view': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Data Sharing & Collaboration</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={pickFileToShare}>
              <MaterialIcons name="upload-file" size={32} color="#FF9800" />
              <Text style={styles.actionTitle}>Share File</Text>
              <Text style={styles.actionDescription}>Upload and share data files</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="people" size={32} color="#4CAF50" />
              <Text style={styles.actionTitle}>Team Workspace</Text>
              <Text style={styles.actionDescription}>Collaborative workspace</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="link" size={32} color="#2196F3" />
              <Text style={styles.actionTitle}>Share Links</Text>
              <Text style={styles.actionDescription}>Generate shareable links</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="history" size={32} color="#9C27B0" />
              <Text style={styles.actionTitle}>Activity Log</Text>
              <Text style={styles.actionDescription}>View sharing history</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share with Collaborator</Text>
          <View style={styles.shareForm}>
            <Text style={styles.formLabel}>Select Item to Share:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.itemSelector}>
                {sharedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemChip,
                      selectedItem?.id === item.id && styles.itemChipSelected,
                    ]}
                    onPress={() => setSelectedItem(item)}
                  >
                    <MaterialIcons 
                      name={getTypeIcon(item.type)} 
                      size={16} 
                      color={selectedItem?.id === item.id ? '#fff' : '#666'} 
                    />
                    <Text style={[
                      styles.itemChipText,
                      selectedItem?.id === item.id && styles.itemChipTextSelected,
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.formLabel}>Collaborator Email:</Text>
            <TextInput
              style={styles.textInput}
              value={shareEmail}
              onChangeText={setShareEmail}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.formLabel}>Permissions:</Text>
            <View style={styles.permissionSelector}>
              {(['view', 'edit', 'comment'] as const).map((permission) => (
                <TouchableOpacity
                  key={permission}
                  style={[
                    styles.permissionChip,
                    selectedItem?.permissions === permission && styles.permissionChipSelected,
                    { borderColor: getPermissionColor(permission) }
                  ]}
                  onPress={() => selectedItem && updatePermissions(selectedItem.id, permission)}
                >
                  <Text style={[
                    styles.permissionText,
                    selectedItem?.permissions === permission && styles.permissionTextSelected,
                    { color: selectedItem?.permissions === permission ? '#fff' : getPermissionColor(permission) }
                  ]}>
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
              onPress={shareWithCollaborator}
              disabled={isSharing}
            >
              {isSharing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.shareButtonText}>Share Data</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared Items</Text>
          {sharedItems.map((item) => (
            <View key={item.id} style={styles.sharedItemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <MaterialIcons name={getTypeIcon(item.type)} size={24} color="#FF9800" />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>
                      {item.type} • {item.createdAt.toLocaleDateString()}
                      {item.size && ` • ${formatFileSize(item.size)}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => shareViaNative(item)}>
                    <MaterialIcons name="share" size={20} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeSharedItem(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.itemPermissions}>
                <View style={styles.permissionBadge}>
                  <Text style={[styles.permissionBadgeText, { color: getPermissionColor(item.permissions) }]}>
                    {item.permissions.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.sharedWithText}>
                  Shared with {item.sharedWith.length} people
                </Text>
              </View>

              {item.sharedWith.length > 0 && (
                <View style={styles.collaboratorsList}>
                  {item.sharedWith.map((email, index) => (
                    <View key={index} style={styles.collaboratorChip}>
                      <MaterialIcons name="person" size={12} color="#666" />
                      <Text style={styles.collaboratorEmail}>{email}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  shareForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemChipSelected: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  itemChipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  itemChipTextSelected: {
    color: '#fff',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  permissionSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  permissionChip: {
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  permissionChipSelected: {
    backgroundColor: '#FF9800',
  },
  permissionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  permissionTextSelected: {
    color: '#fff',
  },
  shareButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  shareButtonDisabled: {
    backgroundColor: '#ccc',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sharedItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  itemPermissions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionBadge: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  permissionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  sharedWithText: {
    fontSize: 12,
    color: '#666',
  },
  collaboratorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  collaboratorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 6,
    paddingHorizontal: 10,
  },
  collaboratorEmail: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
});

export default DataSharingScreen;
