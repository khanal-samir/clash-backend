import express, { Application, Request, Response } from "express";
import "dotenv/config";
import Routes from "./routes/index.js";
import { appLimit } from "./configs/ratelimit.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import { setupSocket } from "./socket.js";

const app: Application = express();
const PORT = process.env.PORT || 8000;
const server: HttpServer = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_APP_URL,
  },
});
setupSocket(io);
export { io };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(appLimit); // limiter for basic routes
app.use(
  // for image upload
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors());

//routes
app.use(Routes);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ msg: "Server is running ;)" });
});

server.listen(PORT, () => console.log(`⚙️ Server is running at port:${PORT}`));
