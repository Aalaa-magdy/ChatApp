import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';

const Home = () => {

    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>
             <Typo size={24} fontWeight={"bold"}>Home</Typo>
        </ScreenWrapper>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})