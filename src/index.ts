import express, { Application, Request, Response } from "express";
import "dotenv/config";
import ejs from "ejs";

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

//queue
import { emailQueue, emailQueueName } from "./jobs/emailJob.js";
app.get("/", async (req: Request, res: Response) => {
  const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, {
    name: "Samir Khanal",
  });
  await emailQueue.add(emailQueueName, {
    to: "khanalsamir52@gmail.com",
    subject: "Testing Queue123",
    html,
  });
  res.json({ msg: "email send successfully" });
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

// app.get("/", async (req: Request, res: Response) => {
//   // const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, {
//   //   name: "Samir Khanal",
//   // });
//   // await sendMail("khanalsamir52@gmail.com", "Testing", html);
//   // res.render("emails/welcome", { name: "Samir Khanal" }); // render welcome file
// });
