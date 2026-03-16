 import type { Socket, Server as SocketServer } from "socket.io";
import Conversation from "../models/conversation.ts";

 export function registerChatEvents(io: SocketServer , socket: Socket){

    socket.on("getConversations", async()=>{
        console.log("get conversations event")
        try{
           const userId =  socket.data.userId;
           if(!userId){
              socket.emit("getConversations",{
               success: false,
               msg: "Unauthorized"
              })
              return;
           }

           // find all the conversations the user is part of 
           const conversations = await Conversation.find({
            participants: userId
           })
           .sort({updatedAt: -1})
           .populate({
              path: "lastMessage",
              select: "content senderId attachment createdAt"
           })
            .populate({
               path : "participants",
               select : "name avatar email"  
            })
            .lean();

            socket.emit("getConversations",{
               success: true,
               data : conversations
            })
            console.log("conversaitons", conversations)
        }
        catch(error:any){
         console.error("Error get conversations", error);
         socket.emit("getConversations",{
             success: false,
             msg: "Failed to get conversations"
         })
        }
    })

    socket.on("newConversation", async(data)=>{
           try{

            if(data.type == "direct"){
                 const existingConversation = await Conversation.findOne({
                     type: "direct",
                     participants: {$all: data.participants , $size: 2}
                 }) .populate ({
                    path: "participants",
                    select: "name avatar email"
                 }) .lean()

                 if(existingConversation){
                    socket.emit("newConversation",{
                        success: true,
                        data: {...existingConversation, isNew: false}
                    }); 
                    return;
                }
            }
            const conversation = await Conversation.create({
                type : data.type,
                participants: data.participants,
                name: data.name || "",
                avatar: data.avatar || "",
                createdBy: socket.data.userId
            })
             // get all the sockets that are connected to the participants of the conversation 
             const connectedSockets = Array.from(io.sockets.sockets.values()).filter(s=>data.participants.includes(s.data.userId) )

             // join this conversation by all online participants
             connectedSockets.forEach(s=>{
                s.join(conversation._id.toString());
             })

             // send conversation data back (populated)
             const populatedConversation = await Conversation.findById(conversation._id)
             .populate({
                path: "participants",
                select: "name avatar email"
             })
             .lean();
              
             if(!populatedConversation){
                throw new Error("Failed to populate conversation");
             }

             io.to(conversation._id.toString()).emit("newConversation",{
                success: true,
                data: {...populatedConversation, isNew: true}
             })
            }
               catch(error){
                console.error("Error creating conversation", error);
                socket.emit("newConversation",{
                    success: false,
                    msg: "Failed to create conversation"
                })
              }
        })
}