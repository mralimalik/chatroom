import { Router } from "express";
import {registerUser,logInUser,getAllUsers} from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/logInUser').post(logInUser);
userRouter.route('/getUsers').get(getAllUsers);





export default userRouter;