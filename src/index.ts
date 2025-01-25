import express, { Application, Request, Response } from "express";
import "dotenv/config";
import ejs from "ejs";
import { sendMail } from "./config/mailer.js";

const app: Application = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // gets directory of current js module

// set view engine --render EJS templates from a "views" folder in your project directory
app.set("view engine", "ejs"); // use ejs
app.set("views", path.resolve(__dirname, "./views"));

app.get("/", async (req: Request, res: Response) => {
  const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, {
    name: "Samir Khanal",
  });
  await sendMail("khanalsamir52@gmail.com", "Testing", html);
  res.json({ msg: "email send successfully" });
  // res.render("emails/welcome", { name: "Samir Khanal" }); // render welcome file
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
