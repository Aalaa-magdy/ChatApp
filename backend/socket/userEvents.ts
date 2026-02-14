import type { Socket, Server as SocketServer } from "socket.io";

 export function registerUserEvents(io: SocketServer , socket: Socket){
    socket.on("testSocket",(data)=>{
       socket.emit("testSocket",{msg: "its working!!"})
    })  

 }