// server/api/ws/[...params].js
import { Server } from 'ws';

let wss; // Global WebSocket server instance

export default defineEventHandler((event) => {
  // Only proceed if this is a WebSocket upgrade request.
  if (event.req.headers.upgrade !== 'websocket') {
    return 'This endpoint only supports WebSocket connections.';
  }

  // Parse dynamic URL segments.
  // Expected URL: /api/ws/{matchType}/{roomId}?user_id=...&reconnect=...
  const params = event.context.params.params; // Array of path segments
  const [matchType = 'free', roomId = 'defaultRoom'] = params || [];
  
  // Extract additional query parameters.
  const urlObj = new URL(event.req.url, `http://${event.req.headers.host}`);
  const userId = urlObj.searchParams.get('user_id');
  const reconnect = urlObj.searchParams.get('reconnect');

  console.log(
    `New WS connection: matchType=${matchType}, roomId=${roomId}, user_id=${userId}, reconnect=${reconnect}`
  );

  // Initialize the WebSocket server once.
  if (!wss) {
    wss = new Server({ noServer: true });
    wss.on('connection', (socket) => {
      console.log(`WebSocket client connected for user ${userId}.`);

      socket.on('message', (message) => {
        console.log(`Received from user ${userId}: ${message}`);
        // Example: echo back the message.
        socket.send(`Echo: ${message}`);
      });

      socket.on('close', () => {
        console.log(`Socket for user ${userId} closed.`);
      });
    });
  }

  // Attach an upgrade listener to handle the WebSocket upgrade.
  event.res.socket.server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith(`/api/ws/${matchType}/${roomId}`)) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });
});
