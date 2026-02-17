import {DecodedTokenProps, UserProps, type AuthContextProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, useState,ReactNode, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { login, register } from "@/services/authService";
import { connectSocket, disconnectSocket } from "@/socket/socket";



export const AuthContext = createContext <AuthContextProps>({
     token: null,
     user: null, 
     signIn: async()=>{},
     signUp : async()=>{},
     signOut : async()=>{},
     updateToken: async()=>{},
})

export const AuthProvider = ({children}:{children:ReactNode})=>{
    const [token , setToken] = useState<string |null> (null);
    const [user , setUser] = useState<UserProps | null>(null);
    const router = useRouter();


    useEffect(()=>{
        loadToken();
    },[]);
    const loadToken = async()=>{
        const storedToken = await AsyncStorage.getItem("token");
        if(storedToken){
            try{
                const decoded = jwtDecode<DecodedTokenProps>(storedToken);
                if(decoded.exp && decoded.exp < Date.now() / 1000){
                    await AsyncStorage.removeItem("token");
                    goToWelcome();
                    return;
                }

                setToken(storedToken);
                await connectSocket();
                setUser(decoded.user);
                goToHome();
            }
            catch(error){
                goToWelcome();
                console.log("failed to load token : ",error );
            }
        }
        else{
            goToWelcome();
        }
    }
    const goToHome = ()=>{
        setTimeout(()=>{
            router.replace("/(main)/home");
        },1500);
    }
    const goToWelcome = ()=>{
        setTimeout(()=>{
            router.replace("/(auth)/welcome");
        },1500);
    }
     
    const updateToken = async(token:string)=>{ 
        if(token){
            setToken(token);
            await AsyncStorage.setItem("token", token);
            const decoded = jwtDecode<DecodedTokenProps>(token);
            setUser(decoded.user);
        }
    }
    


    const signIn = async(email:string, password:string)=>{
        const response = await login(email, password);
        await updateToken(response.token); 
        await connectSocket();
        router.replace("/(main)/home");
    }

    const signUp = async(email:string, password:string, name:string, avatar?:string | null)=>{
        const response = await register(email, password, name, avatar);
        await updateToken(response.token);
        await connectSocket();
        router.replace("/(main)/home");
    }
    const signOut = async()=>{
        try{
            await AsyncStorage.removeItem("token");
            disconnectSocket();
            setToken(null);
            setUser(null);
            router.replace("/(auth)/welcome")
        }
        catch(error){
            console.error("Error signing out", error);
        }
    }
    return (
        <AuthContext.Provider value={{token, user, signIn, signUp, signOut, updateToken}}>
            {children}
        </AuthContext.Provider>
    )

     
}

export const useAuth = ()=> useContext (AuthContext);