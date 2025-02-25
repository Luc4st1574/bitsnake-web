// server/api/ws/[...params].js
import { WebSocketServer } from 'ws';

let wss;

// Attach the upgrade listener only once.
if (!globalThis.__wsUpgradeListenerAttached) {
  // globalThis.__wsUpgradeListenerAttached is our flag.
  globalThis.__wsUpgradeListenerAttached = true;
  // When the server starts, attach one upgrade listener.
  // Here we assume event.res.socket.server will be available from the first call.
  // If necessary, you can also attach this listener in a separate plugin.
  addEventListener('fetch', (event) => {
    // This listener is a no-op; it's here just to make sure our global upgrade listener is attached.
  });
}

export default defineEventHandler((event) => {
  // Only process upgrade requests.
  if (event.req.headers.upgrade !== 'websocket') {
    return 'This endpoint only supports WebSocket connections.';
  }

  // Initialize the WebSocket server if it hasn't been created yet.
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });
    wss.on('connection', (socket, req) => {
      // Parse the URL to extract dynamic parameters.
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      // Example URL: /api/ws/paid/randomRoomId?user_id=1&reconnect=true
      const segments = urlObj.pathname.split('/').filter(Boolean); // e.g. ["api", "ws", "paid", "randomRoomId"]
      const matchType = segments[2] || 'free';
      const roomId = segments[3] || 'defaultRoom';
      const userId = urlObj.searchParams.get('user_id');

      console.log(`New WS connection: matchType=${matchType}, roomId=${roomId}, user_id=${userId}`);

      socket.on('message', (message) => {
        console.log(`Received from user ${userId}: ${message}`);
        // Echo the message back.
        socket.send(`Echo: ${message}`);
      });

      socket.on('close', () => {
        console.log(`Socket for user ${userId} closed.`);
      });
    });

    // Attach the upgrade listener to the underlying HTTP server once.
    event.res.socket.server.on('upgrade', (req, socket, head) => {
      if (req.url.startsWith('/api/ws/')) {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req);
        });
      } else {
        socket.destroy();
      }
    });
  }
});
