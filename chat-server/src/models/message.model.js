import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});


export  const Message = mongoose.model('Message', messageSchema );
