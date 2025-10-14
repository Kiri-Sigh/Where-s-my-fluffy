import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function ChatRoom({ roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    socket.emit("chatMessage", { roomId, message, sender: username });
    setMessage("");
  };

  return (
    <div>
      <h3>Chat Room: {roomId}</h3>
      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender}:</strong> {m.message}
          </p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
