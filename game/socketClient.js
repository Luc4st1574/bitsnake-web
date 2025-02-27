import { io } from 'socket.io-client';

// Use an HTTP URL here so the client connects via HTTP and then upgrades.
const serverUrl = 'http://localhost:8080';

let socket = null;
let room = null;

/**
 * Join a room with all required parameters.
 * @param {string} roomId - The room identifier.
 * @param {string} matchType - The match type ("paid" or "free").
 * @param {string|number} userId - The user identifier.
 * @param {boolean} [reconnect=false] - Whether this is a reconnection.
 */
export const joinRoom = (roomId, matchType, userId, reconnect = false) => {
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
    // Emit joinRoom event with four parameters: roomId, userId, matchType, reconnect flag.
    socket.emit('joinRoom', roomId, userId, matchType, reconnect);
  });

  // Listen for patch event and log its payload
  socket.on('patch', (data) => {
    console.log('Received patch:', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from Socket.IO server:', reason);
  });

  room = { id: roomId, userId };
  localStorage.setItem('lastRoomId', roomId);
  localStorage.setItem('lastUserId', userId.toString());
  return room;
};

/**
 * Attempt to rejoin the last room.
 */
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
  // Pass reconnect=true when rejoining.
  return joinRoom(lastRoomId, matchType, lastUserId, true);
};

/**
 * Leave the current room.
 */
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
