// controllers/conversation.controller.js
import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const createConversation = async (req, res) => {
    try {
        const {currentUserId, otherUserId} = req.body;

        // Validate input
        if (!currentUserId || !otherUserId ) {
            return res.status(400).json({ message: "User IDs are required" });
        }

         // Convert string IDs to ObjectId
         const user1Id = new mongoose.Types.ObjectId(currentUserId);
         const user2Id =new mongoose.Types.ObjectId(otherUserId);

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [user1Id, user2Id] }
        });

        if (!conversation) {
            // Create a new conversation if it doesn’t exist
            conversation = new Conversation({
                participants: [user1Id, user2Id]
            });
            conversation = await conversation.save();
        }

      
      
        return res.status(201).json({
            conversation,
        });
        
    } catch (error) {
        console.error("Error processing conversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const {message, sender , conversation} = req.body;

        // Validate input
        if (!message || !sender || !conversation) {
            return res.status(400).json({ message: "Sender IDs and message content are required" });
        }

         // Convert string IDs to ObjectId
         const senderId =new mongoose.Types.ObjectId(sender);
         const conversationId =new mongoose.Types.ObjectId(conversation);

        // Now, create and send the message in this conversation
        const newMessage = new Message({
            message: message,
            conversationId: conversationId,
            sender: senderId      
           });

        // Save the message to the database
        const savedMessage = await newMessage.save();
        return res.status(201).json({
            message: "Message sent successfully",
            messageData: savedMessage
        });
        
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMessages = async(req,res)=>{
    const { conversation} = req.params;
    console.log("conversation id",conversation)
    // Validate input
    if (!conversation) {
        return res.status(400).json({ message: "Conversation Id is required"});
    }

    const conversationId =new mongoose.Types.ObjectId(conversation);

  // Retrieve messages from the database for the specified conversation with sender details
  const messages = await Message.find({conversationId}).populate('sender', 'name email');

  return res.status(200).json({
      messages,
  });

}

export  {createConversation,sendMessage,getMessages};
