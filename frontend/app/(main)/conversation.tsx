import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { scale, verticalScale } from '@/utils/styling'
import { useLocalSearchParams } from 'expo-router'
import React, { use, useEffect, useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList, Touchable, Alert } from 'react-native'
import * as Icons from "phosphor-react-native"
import MessageItem from '@/components/MessageItem'
import Input from '@/components/Input'
import * as ImagePicker from  'expo-image-picker'
import { Image } from 'expo-image'
import Loading from '@/components/Loading'
import { uploadFileToCloudinary } from '@/services/imageService'
import { getMessages, newMessage } from '@/socket/socketEvents'
import { MessageProps, ResponseProps } from '@/types'


const Conversation = () => {
 
  const {user: currentUser} = useAuth();
   
  const {id : conversationId,
         name,
         avatar,
         participants: stringifiedParticipants,
         type,  
        }= useLocalSearchParams();

  const [message,setMessage] = useState("")  
  const [selectedFile,setSelectedFile] = useState<{uri: string} | null>(null)
  const [loading,setLoading] = useState(false)        
  const [messages,setMessages] = useState<MessageProps[]>([])


  const participants = JSON.parse(stringifiedParticipants as string);  
  let conversationAvatar = avatar;
  let isDirect = type == "direct";    
  let otherParticipant = isDirect ? participants.find((p:any)=> p._id !== currentUser?.id) : null;

  if (isDirect && otherParticipant) 
    conversationAvatar = otherParticipant?.avatar
  
  let conversationName = isDirect ? otherParticipant?.name : name;


  useEffect(()=>{
    getMessages(getMessagesHandler)
    newMessage(newMessageHandler)

    getMessages({conversationId})
    return ()=>{
      getMessages(getMessagesHandler,true)
      newMessage(newMessageHandler,true)
    }
  },[])

 

  const getMessagesHandler = (res:ResponseProps)=>{
      if(res.success){
        setMessages(res.data)
      }
  }

  const newMessageHandler = (res:ResponseProps)=>{
     setLoading(false);
     console.log("new message: ", res);
  }

  const onPickFile = async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
       // allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
  
  //    console.log(result);
  
      if (!result.canceled) {
          setSelectedFile(result.assets[0])
       }
}
   
  const onSend = async()=>{
    if(!message.trim() && !selectedFile) return;
    if(!currentUser) return;
    setLoading(true);

    try{
      let attachment = null;
      if(selectedFile){
         const uploadResult = await uploadFileToCloudinary(selectedFile , "message-attachments")

         if(uploadResult.success){
             attachment = uploadResult.data;
         }
         else{
            setLoading(false);
            Alert.alert("Error","Could not send the image!")
         }
      }
      // console.log("attachment:" , attachment)

      newMessage({
        conversationId: conversationId,
        sender: {
          id: currentUser?.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        content: message.trim(),
        attachment: attachment,
      }); 
      setMessage("");
      setSelectedFile(null);
    } catch(error){
      console.log("Error sending message: ", error)
      Alert.alert("Error","Failed to send message")
    }finally{
        setLoading(false)
    }
  }
  return (
     <ScreenWrapper showPattern={true} bgOpacity={0.5}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
             <Header 
              style={styles.header}
              title={conversationName}
              leftIcon = {
              <View style={styles.headerLeft}>
                 <BackButton />
                 <Avatar 
                  uri={conversationAvatar as string} 
                  size={40}
                  isGroup={type == "group"} />
                  <Typo color={colors.white} fontWeight={"500"}>{conversationName}</Typo>
              </View> }
              rightIcon = {
                  <TouchableOpacity style={styles.plusIcon}>
                    <Icons.DotsThreeOutlineVertical
                     weight="fill"
                     color={colors.white} 
                      />
                  </TouchableOpacity>
              }
              />

          {/* Message List */}
          <View style={styles.content}>
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                inverted={true}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
                contentContainerStyle={styles.messageListContent}
                renderItem={({item}) => <MessageItem item={item} isDirect={isDirect} />}
                keyboardShouldPersistTaps="handled"
              />
          </View>
          <View style={[styles.footer]} >
              <Input 
                value={message}
                onChangeText={setMessage}
                containerStyle={{
                  alignSelf: 'stretch',
                  paddingLeft: spacingX._15,
                  paddingRight: scale(65),
                  borderWidth: 0,
                  backgroundColor: colors.neutral100,
                }}
                placeholder='Type a message ... '
                icon = {
                   <TouchableOpacity style={styles.inputIcon} 
                    onPress={onPickFile}>
                       <Icons.Plus
                         color={colors.black}
                         weight="bold"
                         size={verticalScale(22) }  />
                        
                         {
                          selectedFile && selectedFile.uri && (
                            <Image 
                             source={selectedFile.uri}
                             style={styles.selectedFile} 
                             />
                          )}
                    </TouchableOpacity>
                } 
                />
               <View style={styles.inputRightIcon} >
                  <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                      {
                        loading ? 
                        (<Loading size="small" color={colors.white} />):
                        (<Icons.PaperPlaneTilt 
                          color={colors.black}
                          weight="fill"
                          size={verticalScale(22) }  />)
                      }
                  </TouchableOpacity>
               </View>
            </View>
          </KeyboardAvoidingView> 
     </ScreenWrapper>
  )
}

export default Conversation 

const styles = StyleSheet.create({
   container:{
      flex:1,
   },
   header:{
     paddingHorizontal: spacingX._15,
     paddingTop: spacingY._10,
     paddingBottom: spacingY._15
   },
   headerLeft:{
     flexDirection:"row",
     alignItems:"center",
     gap: spacingX._12  
   },
    inputRightIcon :{
      position:"absolute",
      right: scale(10),
      top: verticalScale(15),
      paddingLeft: spacingX._12,
      borderLeftWidth: 1.5,
      borderLeftColor: colors.neutral300,
    },
    selectedFile:{
        position:"absolute",
        height: verticalScale(38),
        width: verticalScale(38),      
        borderRadius: radius.full,
        alignSelf:"center",
    },
    content:{
      flex:1,
      backgroundColor: colors.white,
      borderTopLeftRadius: radius._50,
      borderTopRightRadius: radius._50,
      borderCurve:"continuous",
      overflow:"hidden",
      paddingHorizontal: spacingX._15 
    },
    inputIcon :{
       backgroundColor: colors.primary,
       borderRadius: radius.full,
       padding:8,
    },
    footer:{
      paddingTop: spacingY._7,
      paddingBottom: verticalScale(22),
      backgroundColor: colors.white,
      paddingHorizontal: spacingX._7,
    },
    flatList:{
      flex: 1,
    },
    messageListContent:{
      paddingVertical: spacingY._20,
      paddingBottom: spacingY._30,
    },
    messageContent:{
      paddingTop: spacingY._20,
      paddingBottom: spacingY._10,
      gap: spacingY._12
    },
    plusIcon:{
      padding: 8,
    }
})