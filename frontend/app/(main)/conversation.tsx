import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { scale, verticalScale } from '@/utils/styling'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from 'react-native'
import * as Icons from "phosphor-react-native"
import MessageItem from '@/components/MessageItem'

const dummyMessages = [
  {
    id: "msg_1",
    sender: { id: "user_2", name: "Jane Smith", avatar: null },
    content: "Hey! How are you doing?",
    createdAt: "10:30 AM",
    isMe: false,
  },
  {
    id: "msg_2",
    sender: { id: "me", name: "Me", avatar: null },
    content: "I'm good, thanks! Just working on the project.",
    createdAt: "10:32 AM",
    isMe: true,
  },
  {
    id: "msg_3",
    sender: { id: "user_2", name: "Jane Smith", avatar: null },
    content: "That sounds great. Need any help?",
    createdAt: "10:35 AM",
    isMe: false,
  },
  {
    id: "msg_4",
    sender: { id: "me", name: "Me", avatar: null },
    content: "Maybe later. I'll let you know when I'm stuck.",
    createdAt: "10:36 AM",
    isMe: true,
  },
  {
    id: "msg_5",
    sender: { id: "user_2", name: "Jane Smith", avatar: null },
    content: "Sure, no problem. Take your time.",
    createdAt: "10:38 AM",
    isMe: false,
  },
  {
    id: "msg_6",
    sender: { id: "me", name: "Me", avatar: null },
    content: "By the way, did you see the new feature they added?",
    createdAt: "10:40 AM",
    isMe: true,
  },
  {
    id: "msg_7",
    sender: { id: "user_2", name: "Jane Smith", avatar: null },
    content: "Which one? There have been a few updates.",
    createdAt: "10:41 AM",
    isMe: false,
  },
  {
    id: "msg_8",
    sender: { id: "me", name: "Me", avatar: null },
    content: "The dark mode toggle. Looks really clean.",
    createdAt: "10:41 AM",
    isMe: true,
  },
  {
    id: "msg_9",
    sender: { id: "me", name: "Me", avatar: null },
    content: "Yes, I'm thinking about adding message reactions next.",
    createdAt: "10:41 AM",
    isMe: true,
  },
  {
    id: "msg_10",
    sender: { id: "user_2", name: "Jane Smith", avatar: null },
    content: "That would be really useful!",
    createdAt: "10:42 AM",
    isMe: false,
  },
  {
    id: "msg_11",
    sender: { id: "user_2", name: "Jane Smith", avatar: null },
    content: "Let me know when it's ready to test.",
    createdAt: "10:43 AM",
    isMe: false,
  },
  {
    id: "msg_12",
    sender: { id: "me", name: "Me", avatar: null },
    content: "Will do. Talk later! 👋",
    createdAt: "10:45 AM",
    isMe: true,
  },
]

const Conversation = () => {
 
  const {user: currentUser} = useAuth();
   
  const {id : conversationId,
         name,
         avatar,
         participants: stringifiedParticipants,
         type,  
        }= useLocalSearchParams();
  const participants = JSON.parse(stringifiedParticipants as string);  
  let conversationAvatar = avatar;
  let isDirect = type == "direct";    
  let otherParticipant = isDirect ? participants.find((p:any)=> p._id !== currentUser?.id) : null;

  if (isDirect && otherParticipant) 
    conversationAvatar = otherParticipant?.avatar
  
  let conversationName = isDirect ? otherParticipant?.name : name;
  return (
     <ScreenWrapper showPattern={true} bgOpacity={0.5}>
        <KeyboardAvoidingView
          behavior={ Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} >
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
                    <Icons.DotsThreeVertical 
                     weight="fill"
                     color={colors.white} 
                     size={verticalScale(20)} />
                  </TouchableOpacity>
              }
              />

          {/* Message List */}
          <View style={styles.content}>
              <FlatList
                data={dummyMessages}
                inverted={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messageContainer}
                renderItem={({item}) => <MessageItem item={item} isDirect={isDirect} />}
                />
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
    },
    messageContainer:{
      flex:1,
    },
    messageContent:{
      paddingTop: spacingY._20,
      paddingBottom: spacingY._10,
      gap: spacingY._12
    },
    plusIcon:{
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      padding:8,
    }
})