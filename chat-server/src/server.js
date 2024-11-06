import {WebSocketServer, WebSocket}  from 'ws';
// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Store connected clients
const clients = new Set();

// Handle client connection
wss.on('connection', (ws) => {

  clients.add(ws);
    console.log('Client connected');

  // Listen for messages from clients
   ws.on('message', (message,isBinary) => {
    // Broadcast the message to all other clients
    clients.forEach((client) => {
      // check if the connection of user is open or not if open then send the message
      if (client.readyState === WebSocket.OPEN) {
    console.log(`Received message  from client=> ${message}`);
        client.send(message, { binary: isBinary });
    console.log(`sent message  to client=> ${message}`);

      }
    });
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
     // Remove the client from the Set
    clients.delete(ws);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
