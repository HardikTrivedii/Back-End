import express from "express";
import { connectDB } from "./config/dbConfig";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { Routes } from "./router";
import morgan from "morgan";
import "./helpher/schedule-backup";
const l10n = require("jm-ez-l10n");
dotenv.config();
connectDB();
export class App {
  protected app: express.Application;
  NODE_ENV: string = `${process.env.NODE_ENV}`;
  constructor() {
    this.app = express();
    express.urlencoded({
      extended: false,
    });
    l10n.setTranslationsFile("en", "src/language/translation.en.json");
    this.app.use(l10n.enableL10NExpress);
    this.app.use(bodyParser.json());

    this.app.set("port", `${process.env.PORT}` || 4000);

    this.app.all("/*", (req, res, next) => {
      res.header(`${process.env.ACCESS_CONTROL_ALLOW_METHODS}`, "*");
      res.setHeader(`${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`, "*");
      res.header(`${process.env.ACCESS_CONTROL_REQUEST_HEADERS}`, "*");
      res.header(
        `${process.env.ACCESS_CONTROL_ALLOW_HEADERS}`,
        `${process.env.ACCESS_CONTROL_ALLOW_HEADERS_VALUE}`
      );
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    });
    this.app.use(morgan("dev"));
    // Routes
    const routes = new Routes(this.NODE_ENV);
    this.app.use("/api", routes.path());

    this.app.get("/", function (_req, res) {
      res.send("Hello world! ");
    });

    this.app.listen(this.app.get("port"), () => {
      console.log(
        `The server is running in port localhost: ${this.app.get("port")}`
      );
    });
  }
}
