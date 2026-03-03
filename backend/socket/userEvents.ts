import type { Socket, Server as SocketServer } from "socket.io";
import User from "../models/user.ts";
import { generateToken } from "../utils/token.ts";
import user from "../models/user.ts";

 export function registerUserEvents(io: SocketServer , socket: Socket){
    socket.on("testSocket",(data)=>{
       socket.emit("testSocket",{msg: "realtime updates are working!!"})
    })  


    
    socket.on("updateProfile", async(data : {name? : string, avatar? : string})=>{
      console.log("update profile event: ", data)

      const userId = socket.data.userId;
      if(!userId){
         return socket.emit("updateProfile" , ({success: false, msg: "Unauthorized"}))
      }
    

    try{
      const updatedUser = await User.findByIdAndUpdate(
         userId,
         {name: data.name, avatar: data.avatar},
         {new: true}
      )
      if(!updatedUser){
        return socket.emit("updateProfile" , ({success: false, msg: "User not found"}))
      }

      const newToken = generateToken(updatedUser);
      socket.emit("updateProfile" , ({success: true, data:{token: newToken}, msg: "Profile updated successfully"}))

   }  catch(error){
     console.error("Error updating profile", error);
     return socket.emit("updateProfileError" , ({success: false, msg: "Internal server error"}))
    }
    
    })

    socket.on("getContacts", async()=>{
       try{
          const currentUserId = socket.data.userId;
          if(!currentUserId){
               socket.emit("getContacts",{
                success: false,
                msg: "Unauthorized"
               })
               return;
          }

          const users = await User.find(
            { _id: {$ne: currentUserId}},
             { password: 0}).lean();

          const contacts = users.map((user)=>({
              id: user._id.toString(),
              name: user.name,
              avatar: user.avatar || "",
          }))

          socket.emit("getContacts",{
            success: true,
            data: contacts,
            msg: "Contacts fetched successfully"
          })

       }
       catch(error:any){
         console.error("Error getting contacts", error);
         socket.emit("getContacts",{
            success: false,
            msg: "Failed to fetch contacts"
         })

       }
    })
 } 