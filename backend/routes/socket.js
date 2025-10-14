// backend/routes/socket.js
// export function chatSocket(io) {
//   io.on("connection", (socket) => {
//     console.log("🟢 New user connected:", socket.id);

//     socket.on("joinRoom", (roomId) => {
//       socket.join(roomId);
//       console.log(`User ${socket.id} joined room ${roomId}`);
//     });

//     socket.on("chatMessage", ({ roomId, message, sender }) => {
//       console.log(`💬 ${sender}: ${message}`);
//       io.to(roomId).emit("chatMessage", { sender, message, time: new Date() });
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 User disconnected:", socket.id);
//     });
//   });
// }
