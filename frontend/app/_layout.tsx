import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/context/authContext'

// Ensure splash (index) is the initial screen, not the first modal in the stack
export const unstable_settings = {
  initialRouteName: 'index',
}

const StackLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(main)/profileModal" 
      options={{presentation:"modal"}} />

    <Stack.Screen name="(main)/newConversationModal" 
      options={{presentation:"modal"}} />  
    </Stack>
  )
}
const RootLayout = () => {
  return (
     <AuthProvider>
        <StackLayout />
     </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})