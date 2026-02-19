import { getSocket } from "./socket";

export const testSocket= (payload:any,off:boolean = false)=>{
    const socket = getSocket();

    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("testSocket",payload); // payload is the callback
    }
    else if(typeof payload === "function"){
        socket.on("testSocket",payload); // payload as callback for this event 
    }
    else{
         socket.emit("testSocket",payload); // payload as data to send to the server
    }

}

export const updateProfile= (payload:any,off:boolean = false)=>{
    const socket = getSocket();

    if(!socket){
        console.log("Socket not connected");
        return;
    }
    if(off){
        socket.off("updateProfile",payload); // payload is the callback
    }
    else if(typeof payload === "function"){
        socket.on("updateProfile",payload); // payload as callback for this event 
    }
    else{
         socket.emit("updateProfile",payload); // payload as data to send to the server
    }

}