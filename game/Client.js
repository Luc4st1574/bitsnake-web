// client.js
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket = null;
let room = null;
let heartbeatInterval = null;

// Read the WS server URL from environment variable.
const serverUrl = import.meta.env.VITE_WS_SERVER;

// Utility function to create a ReconnectingWebSocket instance with common settings.
const createSocket = (url) => {
  // Reconnection options can be adjusted as needed.
  const options = {
    // Maximum number of reconnection attempts before giving up.
    maxRetries: 5,
    // How long to wait (in ms) before trying to reconnect.
    reconnectInterval: 3000,
    // Enable debug logging for development.
    debug: true,
  };

  const rws = new ReconnectingWebSocket(url, null, options);

  rws.onopen = () => {
    console.log('Connected successfully to:', url);
    // Start a heartbeat to keep the connection alive.
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => {
      if (rws.readyState === WebSocket.OPEN) {
        rws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // send a ping every 30 seconds
  };

  rws.onclose = () => {
    console.log('Connection closed.');
    if (heartbeatInterval) clearInterval(heartbeatInterval);
  };

  rws.onerror = (err) => {
    console.log('WebSocket error:', err);
  };

  rws.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  return rws;
};

// Function to reconnect to the last room using stored IDs.
const reconnectRoom = async () => {
  const lastRoomId = localStorage.getItem('lastRoomId');
  const lastSessionId = localStorage.getItem('lastSessionId');

  if (!lastRoomId || !lastSessionId || lastSessionId === "uniqueUserId" || lastSessionId === "0") {
    return null;
  }

  try {
    const sessionDataStr = localStorage.getItem('sessionData');
    let matchType = "free";
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      if (sessionData.paid) {
        matchType = "paid";
      }
    }

    const url = `${serverUrl}/${matchType}/${lastRoomId}?user_id=${lastSessionId}&reconnect=true`;
    socket = createSocket(url);

    room = { id: lastRoomId, sessionId: lastSessionId };
    return room;
  } catch (e) {
    console.log('Room not found', e);
    return null;
  }
};

// Function to join a new room.
const joinRoom = async () => {
  try {
    const sessionDataStr = localStorage.getItem('sessionData');
    let userId = "0";
    let matchType = "free";

    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      userId = sessionData.userID ? sessionData.userID.toString() : "0";
      if (sessionData.paid) {
        matchType = "paid";
      }
    }

    const url = `${serverUrl}/${matchType}/randomRoomId?user_id=${userId}`;
    socket = createSocket(url);

    room = { id: 'randomRoomId', sessionId: userId };

    localStorage.setItem('lastRoomId', room.id);
    localStorage.setItem('lastSessionId', room.sessionId);

    return room;
  } catch (e) {
    console.log('Error joining room:', e);
    return null;
  }
};

// Function to leave the current room.
export const leaveRoom = () => {
  if (!socket) return;
  socket.send(JSON.stringify({ action: 'leave' }));
  socket.close();
  room = null;
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  console.log('Left the room');
};

// Main function to either reconnect or join a room.
export const useRoom = async () => {
  if (!room) room = await reconnectRoom();
  if (!room) room = await joinRoom();
  if (!room) throw new Error('Could not join a room');
  return room;
};

// Export the socket instance so that other modules (like LoadingPage.vue) can listen to events.
export { socket, joinRoom };
