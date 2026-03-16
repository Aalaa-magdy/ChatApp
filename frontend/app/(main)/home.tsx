import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useAuth } from '@/context/authContext';
import Button from '@/components/Button';
import * as Icons from "phosphor-react-native";
import { getConversations, newConversation, testSocket } from '@/socket/socketEvents';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import ConversationItem from '@/components/ConversationItem';
import Loading from '@/components/Loading';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { ConversationProps, ResponseProps } from '@/types';

const Home = () => { 
    const {user,signOut } = useAuth();
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const [selectedTab,setSelectedTab] = useState(0);
    const [conversations,setConversations]= useState<ConversationProps[]>([])
    
   useEffect(()=>{
      getConversations(processGetConversations)
      newConversation(newConversationHandler)

      getConversations(null)
      return ()=>{
        getConversations(processGetConversations,true)
        newConversation(newConversationHandler,true)  
      }
   },[])
   
   const processGetConversations =(res: ResponseProps)=>{
    
       if(res.success){
        setConversations(res.data) 
       }
   }

    useEffect(()=>{
       testSocket(testSocketCallbackHandler);
       testSocket(null);

       return ()=>{
         testSocket(testSocketCallbackHandler,true);
       }
    },[])

    const newConversationHandler = (res:ResponseProps)=>{  
        if(res.success &&   res.data?.isNew){
            setConversations((prev)=>[...prev, res.data]);
        }
    }
     

    const testSocketCallbackHandler = (data:any)=>{
        console.log("got response from testSocket event: ",data); 
    }

    const handleSignOut = async()=>{
        try{
            await signOut();
        }
        catch(error){
            console.error("Error signing out", error);
        }
    }

    // const conversations= [
    //     {
    //         name: "Alice",
    //         type: "direct",
    //         // lastMessage: {
    //         //     senderName: "Alice",
    //         //     content: "Hello, how are you?",
    //         //     createdAt:"2026-02-24T10:00:00.000Z",
    //         // }
    //     },
    //     {
    //         name: "Project Team",
    //         type: "group",
    //         lastMessage: {
    //             senderName: "Sarah",
    //             content: "We are working on the project. We need to finish it by the end of the week.",
    //             createdAt:"2026-02-24T14:00:00.000Z",
    //         }
    //     },
    //     {
    //         name: "Bob",
    //         type: "direct",
    //         lastMessage: {
    //             senderName: "Bob",
    //             content: "I'm busy right now. Can we talk later?",
    //             createdAt:"2026-02-24T16:00:00.000Z",
    //         }
    //     },
    //     {
    //         name: "Family",
    //         type: "group",
    //         lastMessage: {
    //             senderName: "Mom",
    //             content: "We are going to the park this weekend. You should come with us.",
    //             createdAt:"2026-02-24T17:00:00.000Z",
    //         }
    //     },
    //     {
    //         name: "Sarah",
    //         type: "direct",
    //         lastMessage: {
    //             senderName: "Sarah",
    //             content: "Thank you for your help. I appreciate it.",
    //             createdAt:"2026-02-24T16:55 :00.000Z",
    //         }
    //     } 
    // ];

    let directConversations = conversations
    .filter((item:ConversationProps) => item.type == "direct")
    .sort((a:ConversationProps , b:ConversationProps)=> {
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    })

    let groupConversations = conversations
    .filter((item:ConversationProps) => item.type == "group")
    .sort((a:ConversationProps  , b:ConversationProps)=> {
        const aDate = a?.lastMessage?.createdAt || a.createdAt;
        const bDate = b?.lastMessage?.createdAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    })


    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>

            <View style={styles.container}>
               <View style={styles.header}>
                  <View style={{flex:1}}>
                      <Typo color={colors.neutral200} size={19} 
                        textProps={{numberOfLines:1}}>
                        Welcome back, 
                        <Typo size={20} color={colors.white} fontWeight={"800"}>{user?.name}</Typo>
                        <Text>  🤙   </Text>  
                        </Typo> 
                        
                        
                  </View>
                  <TouchableOpacity style={styles.settingIcon} onPress={()=>{router.push("/(main)/profileModal")}}>
                     <Icons.GearSix 
                      color={colors.white}
                      weight="fill"
                      size={verticalScale(20)} /> 
                  </TouchableOpacity>
               </View>
               <View style={styles.content}>
                   <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingVertical:spacingY._20}}>
                      <View style={styles.navBar}>
                          <View style={styles.tabs}>
                              <TouchableOpacity style={[styles.tabStyle , selectedTab === 0 && styles.activeTabStyle]} onPress={()=>{setSelectedTab(0)}}>
                                 <Typo size={16} fontWeight={"600"} color={colors.text}>Direct Messages</Typo>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.tabStyle , selectedTab === 1 && styles.activeTabStyle]} onPress={()=>{setSelectedTab(1)}}>
                                 <Typo size={16} fontWeight={"600"} color={colors.text}>Groups</Typo>
                              </TouchableOpacity>
                          </View>
                      </View>
                      <View style={styles.conversationList }>
                         {
                            selectedTab === 0 && directConversations.map((item:ConversationProps , index) => {
                                return (
                                    <ConversationItem key={index} item={item} 
                                    router={router} showDivider={directConversations.length != index + 1} />
                                )
                            })
                         }
                           {
                            selectedTab === 1  && groupConversations.map((item:ConversationProps , index) => {
                                return (
                                    <ConversationItem key={index} item={item} 
                                    router={router} showDivider={groupConversations.length != index + 1} />
                                )
                            })
                         }
                      </View>
                      {
                        !loading && selectedTab == 0 && directConversations.length==0 &&(
                            <Typo style={{textAlign: "center"}}> You don't have any direct messages yet.</Typo>
                        )
                      }

{
                        !loading && selectedTab == 1 && groupConversations.length==0 && (
                            <Typo style={{textAlign: "center"}}> You don't have any direct messages yet.</Typo>
                        )
                      }

 
                      {
                        loading && <Loading />
                      }

                   </ScrollView>
               </View>
            </View>
             
             <Button 
              style = {styles.floatingButton}
              onPress={()=>{router.push({
                pathname: "/(main)/newConversationModal",
                params : {isGroup : selectedTab}
              }) }}>
                  <Icons.Plus 
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(20)} />
              </Button>
        </ScreenWrapper>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:spacingX._20,
        gap : spacingY._15,
        paddingTop:spacingY._15,
        paddingBottom:spacingY._20,
    },
    row:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    content:{
        flex:1,
        backgroundColor:colors.white,
        borderTopLeftRadius:radius._50,
        borderTopRightRadius:radius._50,
        borderCurve:"continuous",
        overflow:"hidden",
        paddingHorizontal:spacingX._20,
    },
    navBar:{
        flexDirection:"row", 
        gap : spacingX._15,
        alignItems:"center",
        paddingHorizontal:spacingX._20,
    },
    tabs:{
       flexDirection:"row",
       gap: spacingX._10,
       flex:1,
       justifyContent:"center",
       alignItems:"center",
    },
    tabStyle:{
        paddingVertical:spacingY._10,
        paddingHorizontal:spacingX._20,
        borderRadius:radius.full,
        backgroundColor : colors.neutral100,
    }  ,
    activeTabStyle:{
        backgroundColor : colors.primaryLight
    },
    conversationList:{
        paddingVertical: spacingY._20,
    },
    settingIcon:{
        padding: spacingY._10,
        backgroundColor : colors.neutral700,
        borderRadius:radius.full,
    },
    floatingButton:{
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position:"absolute",
        bottom: verticalScale(30),
        right: verticalScale(30),
    }
})