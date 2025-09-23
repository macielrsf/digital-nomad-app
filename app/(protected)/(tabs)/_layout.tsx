import { Tabs } from 'expo-router';
import React from 'react';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { Icon } from '@/src/components/Icon';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray2,
        tabBarLabelStyle: {
          fontFamily: 'PoppinsRegular',
          fontSize: 12,
          fontWeight: 'bold',
          color: colors.text,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          paddingTop: 8,
          height: 90,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'Home-fill' : 'Home-outline'}
              color={focused ? 'primary' : 'gray2'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <Icon name={'Explore'} color={focused ? 'primary' : 'gray2'} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'Person-fill' : 'Person-outline'}
              color={focused ? 'primary' : 'gray2'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
