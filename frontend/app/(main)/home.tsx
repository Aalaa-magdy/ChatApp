import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useAuth } from '@/context/authContext';
import Button from '@/components/Button';
import { testSocket } from '@/socket/socketEvents';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

const Home = () => {
    const {user,signOut } = useAuth();

    useEffect(()=>{
       testSocket(testSocketCallbackHandler);
       testSocket(null);

       return ()=>{
         testSocket(testSocketCallbackHandler,true);
       }
    },[])
     

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
    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>

            <View style={styles.container}>

            </View>
             {/* <Typo size={24} fontWeight={"bold"}>Home</Typo>

             <Button  onPress={handleSignOut} >
                 <Typo>Logout</Typo>
             </Button> */}
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