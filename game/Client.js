let socket = null;
let room = null;

// WebSocket server URL based on the Go server
const serverUrl = `${import.meta.env.VITE_WS_SERVER}`;

// Function to reconnect to the last room using stored IDs
const reconnectRoom = async () => {
  const lastRoomId = localStorage.getItem('lastRoomId');
  const lastSessionId = localStorage.getItem('lastSessionId');
  
  // If lastSessionId is not a valid numeric id, ignore it.
  if (!lastRoomId || !lastSessionId || lastSessionId === "uniqueUserId" || lastSessionId === "0") {
    return null;
  }
  
  try {
    socket = new WebSocket(`${serverUrl}/ws/free/${lastRoomId}?user_id=${lastSessionId}&reconnect=true`);

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

// Function to join a new room
const joinRoom = async () => {
  try {
    // Retrieve session data from localStorage
    const sessionDataStr = localStorage.getItem('sessionData');
    let userId = "0"; // default fallback value
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      userId = sessionData.userID ? sessionData.userID.toString() : "0";
    }
    // Join with a new room using the numeric user id.
    socket = new WebSocket(`${serverUrl}/ws/free/randomRoomId?user_id=${userId}`);

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

    // Save the room and session details to localStorage
    localStorage.setItem('lastRoomId', room.id);
    localStorage.setItem('lastSessionId', room.sessionId);

    return room;
  } catch (e) {
    console.log('Error joining room:', e);
    return null;
  }
};

// Function to leave the current room (send leave signal to server)
export const leaveRoom = () => {
  if (!socket) return;
  socket.send(JSON.stringify({ action: 'leave' }));
  socket.close();
  room = null;
  console.log('Left the room');
};

// Main function to either reconnect to an existing room or join a new one
export const useRoom = async () => {
  // Ensure that if the stored room data does not match the current session, it is cleared.
  const sessionDataStr = localStorage.getItem('sessionData');
  if (sessionDataStr) {
    const sessionData = JSON.parse(sessionDataStr);
    if (!localStorage.getItem('lastSessionId') || localStorage.getItem('lastSessionId') !== sessionData.userID.toString()) {
      localStorage.removeItem('lastRoomId');
      localStorage.removeItem('lastSessionId');
    }
  }
  
  if (!room) room = await reconnectRoom();
  if (!room) room = await joinRoom();
  if (!room) throw new Error('Could not join a room');
  return room;
};

// Also export joinRoom in case other modules need it
export { joinRoom };
