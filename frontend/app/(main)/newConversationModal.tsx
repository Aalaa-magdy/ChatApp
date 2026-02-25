import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import {useLocalSearchParams, useRouter} from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const NewConversationModal = () => {

    const {isGroup} = useLocalSearchParams();
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    
    const contacts =[
        {
            id:"1",
            name:"Malak Taha",
            avatar:"https://unsplash.com/photos/woman-in-white-shirt-taking-selfie-uvnApE6gmnM",
        },
        {
            id:"2",
            name:"Ahmed Mohamed",
            avatar:"https://unsplash.com/photos/man-in-black-shirt-wearing-sunglasses-taking-selfie-oRw7_ZtX00w",
        },
        {
            id:"3",
            name:"Sara Mohamed",
            avatar:"https://unsplash.com/photos/woman-in-white-shirt-taking-selfie-uvnApE6gmnM",
        },
        {
            id:"4",
            name:"Mohamed Ali",
            avatar:"https://unsplash.com/photos/man-in-black-shirt-wearing-sunglasses-taking-selfie-oRw7_ZtX00w",
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