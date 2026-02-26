import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import {useLocalSearchParams, useRouter} from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
 
const NewConversationModal = () => {

    const {isGroup} = useLocalSearchParams();
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
    const onPickImage = async()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
           // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
          });
      
      //    console.log(result);
      
          if (!result.canceled) {
            setGroupAvatar(result.assets[0].uri);
          }
    }
    const contacts =[
        {
            id:"1",
            name:"Malak Taha",
            avatar:"https://unsplash.com/photos/woman-in-white-shirt-taking-selfie-uvnApE6gmnM",
        },
        {
            id:"2",
            name:"Ahmed Mohamed",
            avatar:"https://unsplash.com/photos/a-man-in-a-suit-and-glasses-leaning-against-a-wall-npN-Q3NumpM",
        },
        {
            id:"3",
            name:"Sara Mohamed",
            avatar:"https://unsplash.com/photos/a-woman-standing-in-the-shadows-of-a-wall-KuYt10e1wro",
        },
        {
            id:"4",
            name:"Mohamed Ali",
            avatar:"https://unsplash.com/photos/latin-man-portrait-looking-to-camera-outside-office-in-mexico-city-Qvrg_du6MRA",
        },
    ]

    console.log("isGroup",isGroup);

    return (
    <ScreenWrapper isModal={true} >
        <View style= {styles.container}>
             <Header 
              title={isGroupMode ? "Create Group" : "Select User"}
              leftIcon= {<BackButton color={colors.black} />}
              />
              {
                isGroupMode && (
                    <View style={styles.groupInfoContainer}>
                       <View style={styles.avatarContainer}>
                            <TouchableOpacity onPress={onPickImage}>
                              <Avatar uri={null} size={100} isGroup={true} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
              }
        </View>
    </ScreenWrapper>
    )
}

export default NewConversationModal;

const styles = StyleSheet.create({
       container : {
        marginHorizontal: spacingX._15,
        flex:1,
       },
       groupInfoContainer : {
         alignItems:"center",
         marginTop: spacingY._10,
       },
       avatarContainer : {
        marginBottom: spacingY._10,
       },
       groupNameContainer : {
        width: "100%",
     }, 
     contactRow: {
        flexDirection:"row",
        alignItems:"center",
        gap: spacingX._10,
        paddingVertical: spacingY._5,
     },
     selectedContact:{
        backgroundColor: colors.neutral100,
        borderRadius: radius._15,
     },
     contactList:{
        gap : spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._20,
     },
     selectionIndicator:{
        marginLeft: "auto",
        marginRight: spacingX._10
     },
     checkbox:{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary
     },
     checked:{
        backgroundColor: colors.primary, 
     },
     createGroupButton:{
          position:"absolute",
          bottom : 0,
          left : 0,
          right: 0,
          padding : spacingX._15,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.neutral200,
     }
})