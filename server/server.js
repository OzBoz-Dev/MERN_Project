const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require('socket.io');
const http = require('http');

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

const io = new Server(server, {
        cors: { 
          origin: ["https://mern.poosd.lol", "https://chipin.poosd.lol", "http://localhost:3000"],
          credentials: true
        },
        transports: ["websocket"]
});

app.set("io", io);

server.on('upgrade', (req, socket, head) => {
  console.log('--- LOW LEVEL UPGRADE ATTEMPT ---');
  console.log('Method:', req.method);
  console.log('Path:', req.url);
});

io.engine.on("connection_error", (err) => {
  console.log("--- ENGINE.IO ERROR ---");
  console.log("Code:", err.code);     // e.g. 1 (internal error), 2 (bad request), etc.
  console.log("Message:", err.message); 
  console.log("Context:", err.context); 
});

// connection route 
io.on('connection', (socket) => {
  // join a conversation
  console.log("SOCKET CONNECTED:", socket.id);

  socket.on('joinConversation', (conversationId) => {
    socket.join(String(conversationId));
  });

  socket.on('disconnect', (reason) => {
    console.log("SOCKET DISCONNECTED:", reason);
  });
})

// Routers
const commentsRouter = require("./routes/comments");
const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");
const authRoutes = require("./routes/auth");
const tagsRouter = require("./routes/tags");
const profileRouter = require("./routes/profile");
const postRouter = require("./routes/posts")
const recoveryRouter = require("./routes/recovery");
const myProjectsRouter = require("./routes/my-projects");

app.use("/auth", authRoutes);
app.use("/comments", commentsRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);
app.use("/tags", tagsRouter);
app.use("/profile", profileRouter);
app.use("/posts", postRouter);
app.use("/auth/recovery", recoveryRouter);
app.use("/my-projects", myProjectsRouter);

// Test route
app.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json({
      message: "MERN server is running!",
      database_status: "Connected!",
      db_name: db.databaseName,
      active_collections: collections.map((col) => col.name),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MongoDB connection
const PORT = 5000;
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}!`);


    });
  })
  .catch((err) => console.log(err));