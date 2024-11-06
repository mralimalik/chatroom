import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
    participants:[
        {
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
]
},{timestamps:true});


export const Conversation = mongoose.model('Conversation', conversationSchema );
