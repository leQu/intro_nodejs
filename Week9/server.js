import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

/* SETUP EXPRESS SERVER */
const app = express();
const server = app.listen(3000, () =>
  console.log("Server is running on port 3000"),
);
const socketServer = new Server(server);
// ______________________

/* SETUP FILE PATHS AND SERVE HTML DOCUMENT*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// ______________________

/* SETUP FILE UPLOAD WITH MULTER */
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.post("/upload", upload.single("file"), (req, res) => {
  // When file is uploaded we send a notification to all connected sockets.
  socketServer.emit("newFileUploaded", req.file.originalname || "Unknown file");
  res.send("File uploaded successfully");
});
// ______________________

/* SETUP WEBSOCKET SERVER WITH SOCKET.IO */
socketServer.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    socket.broadcast.emit("chatMessage", msg);
    socket.emit("chatMessage", `You said: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
// ______________________
