import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// to get current js directory
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // gets directory of current js module

// finding from the found directory
// set view engine --render EJS templates from a "views" folder in your project directory
app.set("view engine", "ejs"); // use ejs
app.set("views", path.resolve(__dirname, "./views")); // get views from views directory

app.get("/", (req: Request, res: Response) => {
  res.render("welcome"); // render welcome file
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
