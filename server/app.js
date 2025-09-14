import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"
const app = express()

import { Users, Messages, connectDb } from "./db.js"
import { stat } from "fs"

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const userSocketmap = {} // userId: socket.id

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketmap[userId] = socket.id;

    // Check and create a new user in DB if not found
    const user = await Users.findOne({ "id": userId });
    if (user) {
      console.log("User found", user.id);
    } else {
      await Users.create({ "id": userId });
      console.log("New USER created in db");
    }

    console.log(`User ${userId} connected with socket ${socket.id}`);

    // Send chat history to the client only the reciever's end is filled , not the sender ....
    const history = await Messages.find(
      
        { "receiver": userId }
      
      
    )
      .sort({ currentDate: -1 })
      .limit(5);

    history.reverse();
    socket.emit("chat-history", history);
  }
  //to the reciever ended here..


  //send chat history to the client ,but only the sender's end is filled  , not the reciever .....
  const history2=await Messages.find(
    {"sender":userId}
  )
  .sort({currentDate:-1})
  .limit(5);
  history2.reverse();
  console.log(history2)
  socket.emit("chat-history_sender",history2)
 //to the sender ended here..





  console.log("User Connected");
  console.log("Id", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("recieve-message", { message, sender: userId, room });
  });

  socket.on("message_Individual", async ({ room, message }, callback) => {
  console.log("➡️ message_Individual received:", { room, message });

  try {
    const currentDate = new Date();
    const receiverSocketId = userSocketmap[room.trim()];
    const receiver = await Users.findOne({ id: room.trim() }); // room = receiverId
   console.log(receiver)
    if (!receiver) {
      console.log(`❌ User ${room} not found in DB`);
      return callback({ status: "error", message: `User ${room} not found` });
    }

    // Save the message in DB
    const savedMessage = await Messages.create({
      receiver: room,
      sender: userId,
      message,
      currentDate,
    });

    // Create a unified message object to send back to clients
    const messageData = {
      receiver: savedMessage.receiver,
      sender: savedMessage.sender,
      message: savedMessage.message,
      currentDate: savedMessage.currentDate,
    };

    // If receiver is online, deliver immediately
    if (receiverSocketId) {
      console.log(`📩 Delivering message to online user ${room}`);
      
      // Emit the message to the correct receiver's socket
      socket.to(receiverSocketId).emit("recieve-message", messageData);

      // Also emit the message back to the sender's own socket
      // This ensures the sender's UI is updated instantly
      socket.emit("recieve-message", messageData);

      return callback({ status: "delivered" });
    }

    // If receiver exists but is offline
    console.log(`💾 Stored message for offline user ${room}`);

    // Still send the message back to the sender's UI
    socket.emit("recieve-message", messageData);

    return callback({ status: "stored-offline" });

  } catch (error) {
    console.error("🔥 DB failure in message_Individual:", error);
    return callback({ status: "error", message: "db failure" });
  }
});


  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    // You might want to remove the user from userSocketmap here
    for (const key in userSocketmap) {
        if (userSocketmap[key] === socket.id) {
            delete userSocketmap[key];
            break;
        }
    }
  });
});

app.get("/health", (req, res) => {
  res.send("Server is running.");
});

connectDb().then(() => {
  server.listen(4000, () => {
    console.log('Server listening at 4000');
  });
});
