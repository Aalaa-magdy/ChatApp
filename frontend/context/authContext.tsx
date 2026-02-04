import {UserProps, type AuthContextProps } from "@/types";
import { createContext, useState,ReactNode } from "react";

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

     
}