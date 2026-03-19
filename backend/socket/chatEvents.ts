 import type { Socket, Server as SocketServer } from "socket.io";
import Conversation from "../models/conversation.ts";
import Message from "../models/message.ts";

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

    socket.on("newMessage", async (data)=>{
        console.log("newMessage event: ", data);
        try{
           const message = await Message.create({
             conversationId: data.conversationId,
             senderId : data.sender.id,
             content: data.content,
             attachment: data.attachment,
           })

           io.to(data.conversationId).emit("newMessage",{
            success: true,
            data: {
               id:message._id,
               content: data.content,
               sender: {
                  id:data.sender.id,
                  name: data.sender.name,
                  avatar: data.sender.avatar,
               },
               attachment: data.attachment,
               createdAt: new Date().toISOString() ,
               conversationId : data.conversationId,
            }
         });
         
         // update the conversation with the new message
         await Conversation.findByIdAndUpdate(data.conversationId, {
            lastMessage: message._id,
         })


        }
        catch(error){ 
         console.error("Error newMessage", error);
         socket.emit("newMessage",{
             success: false,
             msg: "Failed send new message"
         })}
    })   
    socket.on("getMessages", async (data : {conversationId: string}) =>{
        console.log("getMessages event: ", data);
        try{
           const messages = await Message.find({
             conversationId: data.conversationId
           })
           .sort({createdAt: -1})
           .populate<{senderId  : { _id: string, name: string, avatar: string}}>({
            path: "senderId",
            select: "name avatar"
           })
           .lean();

           const messagesWithSender = messages.map((message)=>({
            ...message,
            sender: {
              id: message.senderId._id,
              name: message.senderId.name,
              avatar: message.senderId.avatar,
            }
           }))

           socket.emit("getMessages",{
            success: true,
            data: messagesWithSender
           })
        }
        catch(error){ 
         console.error("Error getMessages", error);
         socket.emit("getMessages",{
             success: false,
             msg: "Failed to get messages"
         })}
    })   
}