import express from 'express';
import connectDatabase from './database.js';
import userRouter from './router/user.routes.js';
import conversationRouter from './router/conversation.routes.js';
import cors from 'cors'
const app = express();
const port = 3000;
app.use(cors())
app.use(express.json());


app.use('/users',userRouter)
app.use('/convo',conversationRouter)






// Start server and connect to MongoDB
app.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on  http://localhost:${port}`);
});




