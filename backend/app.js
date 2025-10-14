import express from "express";
import http from "http";
import cors from "cors";
// import { Server } from "socket.io";
import landmarksRouter from "./routes/landmark.js";
// import { chatSocket } from "./routes/socket.js";
import userRoutes from "./routes/users.js";
import listingRoutes from "./routes/listings.js";
import loginRoutes from "./routes/login.js";
import addressRoutes from "./routes/address.js";
import pinnedRoutes from "./routes/pinned.js";
import myListRoutes from "./routes/my_list.js";
import notiRoutes from "./routes/notification.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use("/api/landmarks", landmarksRouter);
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/login", loginRoutes);
app.use("/address", addressRoutes);
app.use("/pinned", pinnedRoutes);
app.use("/my-lists", myListRoutes);
app.use("/notifications", notiRoutes);

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// chatSocket(io);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
