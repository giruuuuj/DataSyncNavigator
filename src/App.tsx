import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './components/HomeScreen';
import DataVisualizationScreen from './screens/DataVisualizationScreen';
import FormatConverterScreen from './screens/FormatConverterScreen';
import FileMergerScreen from './screens/FileMergerScreen';
import DataCleanerScreen from './screens/DataCleanerScreen';
import ApiTesterScreen from './screens/ApiTesterScreen';
import SqlPlaygroundScreen from './screens/SqlPlaygroundScreen';
import DataInsightsScreen from './screens/DataInsightsScreen';
import DataSharingScreen from './screens/DataSharingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'DataSync Navigator' }}
      />
      <Stack.Screen
        name="DataInsights"
        component={DataInsightsScreen}
        options={{ title: 'Smart Data Insights' }}
      />
      <Stack.Screen
        name="DataSharing"
        component={DataSharingScreen}
        options={{ title: 'Data Sharing & Collaboration' }}
      />
      <Stack.Screen
        name="DataVisualization"
        component={DataVisualizationScreen}
        options={{ title: 'Data Visualization' }}
      />
      <Stack.Screen
        name="FormatConverter"
        component={FormatConverterScreen}
        options={{ title: 'Format Converter' }}
      />
      <Stack.Screen
        name="FileMerger"
        component={FileMergerScreen}
        options={{ title: 'File Merger' }}
      />
      <Stack.Screen
        name="DataCleaner"
        component={DataCleanerScreen}
        options={{ title: 'Data Cleaner' }}
      />
      <Stack.Screen
        name="ApiTester"
        component={ApiTesterScreen}
        options={{ title: 'API Tester' }}
      />
      <Stack.Screen
        name="SqlPlayground"
        component={SqlPlaygroundScreen}
        options={{ title: 'SQL Playground' }}
      />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
