import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'

const welcome = () => {
  return (
     <ScreenWrapper showPattern={true} style={{paddingHorizontal:20}}>
        <Text>Welcome Screen</Text>
     </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({})