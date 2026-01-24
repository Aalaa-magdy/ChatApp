import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'

const welcome = () => {
  return (
     <ScreenWrapper showPattern={true} >
        <View style={styles.container}>
            <View style={{alignItems:"center"}}>
                <Typo color={colors.white} size={43} fontWeight={"900"}>
                    Bubbly
                </Typo>
            </View>
            <Animated.Image
               entering = {FadeIn.duration(700).springify()}
                source={require('@/assets/images/welcome.png')}
                style = {styles.welcomeImage}
                resizeMode= {"contain"} />
                

        </View>
     </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
    container :{
        flex:1,
        justifyContent:"space-around",
        paddingHorizontal : spacingX._20,
        marginVertical : spacingY._10
    },
    background:{
        flex:1,
        backgroundColor: colors.neutral900,
    },
    welcomeImage:{
        height: verticalScale(300),
        aspectRatio: 1,
        alignSelf: 'center',
    }
})