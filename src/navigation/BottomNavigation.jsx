import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import Action from '../screens/Action';
import Explore from '../screens/Explore';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Action') iconName = 'flash-outline';
          else if (route.name === 'Explore') iconName = 'compass-outline';
          else if (route.name === 'Profile') iconName = 'person-circle-outline';

          return (
            <Icon
              name={iconName}
              size={focused ? size + 6 : size}
              color={focused ? '#00f0ff' : '#888'}
            />
          );
        },
        tabBarActiveTintColor: '#00f0ff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          overflow: 'hidden',
        },

        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Action" component={Action} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
