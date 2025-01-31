import express, { Application, Request, Response } from "express";
import "dotenv/config";
import Routes from "./routes/index.js";
import { appLimit } from "./configs/ratelimit.js";
const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLimit); // limiter for basic routes

//routes
app.use(Routes);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ msg: "Server is running ;)" });
});

app.listen(PORT, () => console.log(`⚙️ Server is running at port:${PORT}`));
