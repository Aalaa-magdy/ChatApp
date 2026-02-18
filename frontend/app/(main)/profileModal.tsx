import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import Avatar from '@/components/Avatar';
import * as Icons from "phosphor-react-native";
import Typo from '@/components/Typo';
import Input from '@/components/Input';

const ProfileModal = () => {
    return (
        <ScreenWrapper isModal={true} >
            <View style={styles.container}>
                <Header 
                 title={"Update Profile"}
                 leftIcon={
                    Platform.OS === "android" && <BackButton color={colors.black} /> 
                 }
                 style={{ marginVertical :spacingY._15}}/>

                 <ScrollView contentContainerStyle={styles.form}>
                     <View style={styles.avatarContainer}>
                        <Avatar uri={null}  size={170}/>
                        <TouchableOpacity style={styles.editIcon}>
                             <Icons.Pencil size={verticalScale(20) } color={colors.neutral800} />
                        </TouchableOpacity>
                     </View>

                     <View style={{gap : spacingY._20}}>
                         <View style={styles.inputContainer}>
                            <Typo style={{paddingLeft : spacingX._10}}> Email</Typo>

                            <Input 
                              value={""}
                              containerStyle={{
                                borderColor: colors.neutral350,
                                paddingLeft: spacingX._20,
                                backgroundColor: colors.neutral300,
                              }} /> 
                         </View>
                     </View>
                 </ScrollView>
            </View> 


        </ScreenWrapper>
    )
}

export default ProfileModal;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:"space-between",
        paddingHorizontal: spacingX._20,
    },
    footer:{
        alignItems:"center",
        flexDirection:"row",
        justifyContent:"center",
        paddingHorizontal: spacingX._20,
        gap : scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral200,
        marginBottom : spacingY._10,
        borderTopWidth: 1,
    },
    form:{
        gap : spacingY._30,
        marginTop : spacingY._15
    },
    avatarContainer:{
       position: "relative",
       alignSelf:"center",
    },
    avatar:{
        alignSelf:"center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,


    },
    editIcon:{
        position:"absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset:{width:0, height:0 },
        shadowOpacity:0.25,
        shadowRadius:10,
        elevation:4,
        padding: spacingY._7,
    },
    inputContainer:{
        gap : spacingY._7
    }
});