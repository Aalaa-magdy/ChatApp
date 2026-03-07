import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import {useLocalSearchParams, useRouter} from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Input from "@/components/Input";
import { ScrollView } from "react-native";
import Typo from "@/components/Typo";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";
import { getContacts, newConversation } from "@/socket/socketEvents";
 
const NewConversationModal = () => {

    const {isGroup} = useLocalSearchParams();
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    const [contacts, setContacts] = useState([]);
    const [groupAvatar, setGroupAvatar] = useState< {uri: string} | null>(null);
    const [groupName, setGroupName] = useState<string>("");
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    
    const {user:currentUser} = useAuth();
    const [isLoading, setIsLoading] = useState(false);


    useEffect (()=>{
        getContacts(processGetContacts);
        newConversation(processNewConversation);
        getContacts(null);
        return ()=>{
            getContacts(processGetContacts,true);
        }
    },[]);

    const processGetContacts = (res:any)=>{
        console.log("process get contacts: ", res);
        if(res.success){
            setContacts(res.data);
        }
    }
    const processNewConversation = (res:any)=>{
        console.log("process new conversation: ", res);
        if(res.success){ 
            router.push(`/chat/${res.data._id}`);
        }
    }
    const onPickImage = async()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
           // allowsEditing: true,
            aspect: [4, 3], 
            quality: 0.5,
          });
      
      //    console.log(result);
      
          if (!result.canceled) {
            setGroupAvatar(result.assets[0]);
          }
    }

    const toggleParticipant = (user:any)=>{
        setSelectedParticipants((prev:any)=>{
            if(prev.includes(user.id)){
                return prev.filter((id: string)=> id !== user.id);
            }
            return [...prev, user.id];
        });
    }

   const onSelectUser = (user:any)=>{
        if(!currentUser){
            Alert.alert("Authentication Error", "Please login to start a conversation");
            return;
        }
        if(isGroupMode){
            toggleParticipant(user);
        }
        else{
             newConversation({
                type: "direct",
                participants: [currentUser.id, user.id],
             })
        }
   }
   
   const createGroup = async()=>{

      if(!groupName.trim() || !currentUser || selectedParticipants.length < 2){
        return ;
      }
      
   }

    // Use direct image URLs: Unsplash page URLs (unsplash.com/photos/...) return HTML, not images.
    // These are direct CDN URLs that expo-image can load.
    // const contacts =[
    //     {
    //         id:"1",
    //         name:"Malak Taha",
    //         avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    //     },
    //     {
    //         id:"2",
    //         name:"Ahmed Mohamed",
    //         avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    //     },
    //     {
    //         id:"3",
    //         name:"Sara Mohamed",
    //         avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    //     },
    //     {
    //         id:"4",
    //         name:"Mohamed Ali",
    //         avatar:"https://images.unsplash.com/photo-1604612570084-f0f35379ed71?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         id:"5",
    //         name:"Salma Khaled",
    //         avatar:"https://images.unsplash.com/photo-1604054388996-00aa182dbe0e?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         id:"6",
    //         name:"Alaa Ahmed",
    //         avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    //     },
    //     {
    //         id:"7",
    //         name:"Yara El-Sayed",
    //         avatar:"https://plus.unsplash.com/premium_photo-1668443423892-2783b69f4387?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         id:"8",
    //         name:"Nour Mohamed",
    //         avatar:"https://images.unsplash.com/photo-1741291468276-29867cc7a3d5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         id:"9",
    //         name:"Hadeer Ali",
    //         avatar:"https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         id:"10",
    //         name:"Gamal Ahmed",
    //         avatar:"https://images.unsplash.com/photo-1579798099187-dfb42cf64378?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    //     }
    // ]

  

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
                              <Avatar uri={groupAvatar?.uri || null} size={100} isGroup={true} />
                            </TouchableOpacity>
                        </View>
  
                     <View style={styles.groupNameContainer}>
                         <Input 
                          placeholder="Group Name" 
                          value={groupName}
                          onChangeText={setGroupName}
                          />
                      </View> 
                    </View>

                )
              }
              <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.contactList}>
                  {
                    contacts.map((user:any,index)=>{
                        const isSelected = selectedParticipants.includes(user.id) ;
                        return (
                            <TouchableOpacity
                              key={index}
                              style={[styles.contactRow, isSelected && styles.selectedContact]}
                              onPress={()=> onSelectUser(user)}>
                                <Avatar uri={user.avatar} size={40} />
                                <Typo size={16} fontWeight={"600"}>{user.name}</Typo>
                                {
                                     isGroupMode && (
                                        <View style={styles.selectionIndicator}>
                                            <View style={[styles.checkbox, isSelected &&   styles.checked ]} >

                                            </View>
                                        </View>
                                     )
                                }
                              </TouchableOpacity>
                        )
                    })
                  }
               </ScrollView>
               {
                   isGroupMode && selectedParticipants.length >= 2 && (
                      <View style={styles.createGroupButton}>
                        <Button  
                           onPress={createGroup}
                           disabled={!groupName.trim()} 
                           loading={isLoading}>
                            <Typo size={17} fontWeight={"bold"}>Create Group</Typo>
                        </Button>
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
        paddingBottom: verticalScale(150),
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