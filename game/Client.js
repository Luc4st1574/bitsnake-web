let socket = null;
let room = null;

// WebSocket server URL based on the Go server
const serverUrl = `${import.meta.env.VITE_WS_SERVER}`;

// Function to reconnect to the last room using stored IDs
const reconnectRoom = async () => {
  const lastRoomId = localStorage.getItem('lastRoomId');
  const lastSessionId = localStorage.getItem('lastSessionId');
  
  // If lastSessionId is not valid, ignore it.
  if (!lastRoomId || !lastSessionId || lastSessionId === "uniqueUserId" || lastSessionId === "0") {
    return null;
  }
  
  try {
    // Determine match type from session data
    const sessionDataStr = localStorage.getItem('sessionData');
    let matchType = "free";
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      if (sessionData.paid) {
        matchType = "paid";
      }
    }
    
    socket = new WebSocket(`${serverUrl}/ws/${matchType}/${lastRoomId}?user_id=${lastSessionId}&reconnect=true`);

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
    let matchType = "free"; // default match type

    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      userId = sessionData.userID ? sessionData.userID.toString() : "0";
      // Use paid match type if session data indicates a paid session.
      if (sessionData.paid) {
        matchType = "paid";
      }
    }
    // Join with a new room using the numeric user id and the correct match type.
    socket = new WebSocket(`${serverUrl}/ws/${matchType}/randomRoomId?user_id=${userId}`);

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
  if (!room) room = await reconnectRoom();
  if (!room) room = await joinRoom();
  if (!room) throw new Error('Could not join a room');
  return room;
};

// Also export joinRoom in case other modules need it
export { joinRoom };
