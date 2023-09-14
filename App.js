import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NoteScreen from './NoteScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Notas" component={NoteScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
