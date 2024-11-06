import { Router } from "express";
import {createConversation,sendMessage,getMessages} from "../controllers/conversation.controller.js";

const conversationRouter = Router();
conversationRouter.post("/create", createConversation);
conversationRouter.post("/sendMessage", sendMessage);
conversationRouter.get("/:conversation", getMessages);




export default conversationRouter;
