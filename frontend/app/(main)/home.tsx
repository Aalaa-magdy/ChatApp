import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { useAuth } from '@/context/authContext';
import Button from '@/components/Button';
import { testSocket } from '@/socket/socketEvents';

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
             <Typo size={24} fontWeight={"bold"}>Home</Typo>

             <Button  onPress={handleSignOut} >
                 <Typo>Logout</Typo>
             </Button>
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