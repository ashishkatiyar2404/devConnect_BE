const socketIO = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/Chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (httpServer) => {
  // initializes Socket.IO on our existing HTTP server.
  // "io" represents the whole Socket.IO server.(instance)
  const io = socketIO(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // whenever a client connects to Socket.IO server, run this function OR this func will run
  // "socket" in param is connected client
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // .on()->listen for an event, when FE emit event(socket.emit) thn BE will listen
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const uniqueRooomId = getSecretRoomId(userId, targetUserId);
      socket.join(uniqueRooomId);
      console.log(firstName + "wants to join chat-- " + uniqueRooomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // saving messages to the database
        try {
          const uniqueRooomId = getSecretRoomId(userId, targetUserId);

          //TODO: Check if userId and targetUserId are friends

          let chat = await chatModel.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new chatModel({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(uniqueRooomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            senderId: userId,
          });
        } catch (error) {
          console.log(error);
        }
      },
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
