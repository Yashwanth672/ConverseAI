import socket from 'socket.io-client';


let socketInstance = null;


export const initializeSocket = (projectId) => {
    // Reuse existing socket if already initialized for stability in React StrictMode
    if (socketInstance) return socketInstance;

    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    });

    return socketInstance;
}

// Subscribe to an event and return an unsubscribe function
export const receiveMessage = (eventName, cb) => {
    if (!socketInstance) return () => {}
    socketInstance.on(eventName, cb);
    return () => {
        try { socketInstance.off(eventName, cb); } catch (e) { }
    }
}

export const sendMessage = (eventName, data) => {
    socketInstance?.emit(eventName, data);
}

export const offMessage = (eventName, cb) => {
    socketInstance?.off(eventName, cb);
}

export const getSocket = () => socketInstance;