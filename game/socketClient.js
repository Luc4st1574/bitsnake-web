import { io } from 'socket.io-client';

// Use an HTTP URL here so the client connects via HTTP and then upgrades.
const serverUrl = 'http://localhost:8080';

let socket = null;
let room = null;

export const joinRoom = (roomId, matchType, userId) => {
  socket = io(serverUrl, {
    path: '/socket.io',
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    query: { roomId, matchType, userId }
  });

  socket.on('connect', () => {
    console.log(`Connected to Socket.IO server with id: ${socket.id}`);
    // Emit joinRoom event to join the desired room
    socket.emit('joinRoom', roomId, userId);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from Socket.IO server:', reason);
  });

  room = { id: roomId, userId };
  localStorage.setItem('lastRoomId', roomId);
  localStorage.setItem('lastUserId', userId.toString());
  return room;
};

export const reconnectRoom = () => {
  const lastRoomId = localStorage.getItem('lastRoomId');
  const lastUserId = localStorage.getItem('lastUserId');
  if (!lastRoomId || !lastUserId) return null;
  // Assume matchType from sessionData or default to "free"
  let matchType = 'free';
  const sessionDataStr = localStorage.getItem('sessionData');
  if (sessionDataStr) {
    const sessionData = JSON.parse(sessionDataStr);
    if (sessionData.paid) matchType = 'paid';
  }
  return joinRoom(lastRoomId, matchType, lastUserId);
};

export const leaveRoom = () => {
  if (socket) {
    socket.emit('leaveRoom');
    socket.disconnect();
    socket = null;
    room = null;
    localStorage.removeItem('lastRoomId');
    localStorage.removeItem('lastUserId');
    console.log('Left the room.');
  }
};

export { socket };
