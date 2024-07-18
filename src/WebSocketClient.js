import React, { useState, useCallback, useEffect } from 'react';

const WebSocketClient = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Function to handle opening the WebSocket connection
    const openConnection = useCallback(() => {
        if (ws) {
            console.warn('WebSocket connection already open.');
            return;
        }

        const newWs = new WebSocket('ws://localhost:8080');

        newWs.onopen = () => {
            console.log('Connected to the WebSocket server.');
            setIsConnected(true);
        };

        newWs.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        newWs.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        newWs.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            setIsConnected(false);
        };

        setWs(newWs);

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            newWs.close();
            setWs(null);
        };
    }, [ws]);

    // Function to handle closing the WebSocket connection
    const closeConnection = useCallback(() => {
        if (ws) {
            ws.close();
            setWs(null);
            setIsConnected(false);
        } else {
            console.warn('No WebSocket connection to close.');
        }
    }, [ws]);

    // Effect to manage WebSocket connection cleanup
    useEffect(() => {
        return () => {
            if (ws) {
                ws.close();
                setWs(null);
            }
        };
    }, [ws]);

    return (
        <div className="websocket-container">
            <h1>WebSocket Messages</h1>
            <div className="button-container">
                <button onClick={openConnection} disabled={isConnected}>
                    Open Connection
                </button>
                <button onClick={closeConnection} disabled={!isConnected}>
                    Close Connection
                </button>
            </div>
            <ul className="message-list">
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketClient;
