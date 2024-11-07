import { WebSocketServer, WebSocket } from "ws";
// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Store connected clients
const clients = new Set();

//store online users
const onlineUsers = new Map();

// Handle client connection
wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("Client connected");

  // Listen for messages from clients
  ws.on("message", (message, isBinary) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "register") {
      // Register the user in the onlineUsers map
      const { userId } = parsedMessage;
      onlineUsers.set(userId, ws);
      console.log("registering online users ",onlineUsers)
      sendOnlineUsersToClient();
    }else if (parsedMessage.type === "onlineUsers") {
      console.log("sending online users ",onlineUsers)
    } else {
      // Broadcast the message to all other clients
      clients.forEach((client) => {
        // check if the connection of user is open or not if open then send the message
        if (client.readyState === WebSocket.OPEN) {
          console.log(`Received message  from client=> ${message}`);
          client.send(message, { binary: isBinary });
          console.log(`sent message  to client=> ${message}`);
        }
      });
    }
  });

  // Handle client disconnections
  ws.on("close", () => {
    console.log("Client disconnected");
    // Remove the client from the Set
    clients.delete(ws);
    // Find and remove the disconnected user from onlineUsers
    onlineUsers.forEach((userWs, userId) => {
      if (userWs === ws) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} is now offline`);
      }
    });
    sendOnlineUsersToClient();
  });
});

function sendOnlineUsersToClient() {
  // Notify all clients about the updated online users list
  const onlineUsersList = Array.from(onlineUsers.keys());
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "onlineUsers",
          onlineUsers: onlineUsersList,
        })
      );
    }
  });
}
console.log("WebSocket server running on ws://localhost:8080");
