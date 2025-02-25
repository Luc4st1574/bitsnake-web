// game/Client.js
import { createNitroSocket } from 'nitro-websocket' // Replace with your actual Nitro WS helper

let socket = null;
let room = null;

const serverUrl = import.meta.env.VITE_WS_SERVER; // e.g., 'ws://localhost:8080'

// Connect to a room using Nitro WebSocket
const connectToRoom = async (matchType, roomId, userId, reconnect = false) => {
  const wsUrl = `${serverUrl}/ws/${matchType}/${roomId}?user_id=${userId}${reconnect ? '&reconnect=true' : ''}`;
  
  // Create a socket connection using the Nitro helper
  socket = createNitroSocket(wsUrl);
  
  socket.on('open', () => {
    console.log('Connected via Nitro WS');
  });
  
  socket.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg);
      // Handle backend broadcasts
      if (parsed.type === 'players-update') {
        if (room && room.emit) {
          room.emit('players-update', parsed.players);
        }
      } else if (parsed.type === 'game-start') {
        if (room && room.emit) {
          room.emit('game-start', parsed);
        }
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  });
  
  socket.on('error', (err) => {
    console.error('Nitro WS error:', err);
  });
  
  // Create a room object with basic event emitter functionality
  room = {
    id: roomId,
    sessionId: userId,
    _listeners: {},
    onEvent(event, callback) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(callback);
    },
    emit(event, payload) {
      if (this._listeners[event]) {
        this._listeners[event].forEach((cb) => cb(payload));
      }
    },
    send(action, data) {
      socket.send(JSON.stringify({ action, data }));
    },
  };
  return room;
};

export const useRoom = async () => {
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
  const roomId = localStorage.getItem('lastRoomId') || 'randomRoomId';
  room = await connectToRoom(matchType, roomId, userId);
  localStorage.setItem('lastRoomId', room.id);
  localStorage.setItem('lastSessionId', room.sessionId);
  return room;
};

export const leaveRoom = () => {
  if (!socket) return;
  socket.send(JSON.stringify({ action: 'leave' }));
  socket.close();
  room = null;
  console.log('Left the room');
};

export { joinRoom }; // Export if additional joining logic is needed
