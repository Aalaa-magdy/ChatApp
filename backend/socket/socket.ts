import dotenv from "dotenv";
import { Server } from "socket.io";
import type { Socket } from "socket.io";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { registerUserEvents } from "./userEvents.ts";
import { registerChatEvents } from "./chatEvents.ts";
import Conversation from "../models/conversation.ts";

dotenv.config();

export function initializeSocket(server: import("http").Server): Server {
       const io = new Server(server, {
          cors: {
            origin: "*",
          }
       });  

       io.use((socket: Socket, next) => {
          const token = socket.handshake.auth.token;
          if (!token) {
             return next(new Error("Authentication error: Token is required"));
          }
        
          jwt.verify(token, process.env.JWT_SECRET as string , (err:any , decoded:any)=>{
               if(err){
                return next(new Error("Authentication error: Token is required"));
               }

               let userData = decoded.user;
               socket.data = userData;
               socket.data.userId = userData.id;
               next(); 

            }) ;
         
       
       });
       // when socket connects , register events 
       io.on("connection", async (socket:Socket)=>{
         const userId = socket.data.userId;
         
         // register chat events
         registerChatEvents(io,socket);
         registerUserEvents(io,socket);
          
       // join all the conversations the user is part of
         try{
            const conversations = await Conversation.find({
               participants: userId
             }).select("_id")

             conversations.forEach((conversation)=>{
                socket.join(conversation._id.toString());
             })
         }
         catch(error :any){
            console.error("Error joining conversations", error);
         }
         socket.on("disconnect",()=>{
            console.log(`user disconnected from the socket : ${userId} ` );  
         })
       })

       return io;
}   