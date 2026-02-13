import dotenv from "dotenv";
import { Server } from "socket.io";
import type { Socket } from "socket.io";
import jwt, { type JwtPayload } from "jsonwebtoken";

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

       return io;
}