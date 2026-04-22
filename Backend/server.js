import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { setIo } from "./src/utils/socketUtils.js";

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: true,
  },
  path: "/socket.io",
});

setIo(io);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.id;
    }
    next();
  } catch (err) {
    next();
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log("[socket.io] client connected", { userId, id: socket.id });
  if (userId) {
    socket.join(`user:${userId}`);
  }
  socket.emit("connected", { ok: true });

  socket.on("disconnect", () => {
    console.log("[socket.io] client disconnected", { id: socket.id });
  });
});

server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Socket.IO endpoint: http://localhost:${PORT}/socket.io/?EIO=4&transport=polling`);
});
