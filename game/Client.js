// client.js
let socket = null;
let room = null;

// Read the WS server URL from environment variable.
const serverUrl = import.meta.env.VITE_WS_SERVER;

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

    socket = new WebSocket(`${serverUrl}/${matchType}/${lastRoomId}?user_id=${lastSessionId}&reconnect=true`);

    socket.onopen = () => {
      console.log('Reconnected successfully');
    };

    socket.onerror = (err) => {
      console.log('Reconnection failed:', err);
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

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

    socket = new WebSocket(`${serverUrl}/${matchType}/randomRoomId?user_id=${userId}`);

    socket.onopen = () => {
      console.log('Joined successfully');
    };

    socket.onerror = (err) => {
      console.log('Error joining room:', err);
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

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
