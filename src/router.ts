import express = require("express");
import { authRouter } from "./routers/authRouter";

export class Routes {
  protected basePath: any;

  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case "production":
        this.basePath = "/app/dist";
        break;
      case "development":
        this.basePath = "/app/public";
        break;
    }
  }

  public defaultRoute(_req: express.Request, res: express.Response) {
    res.json({
      message: "Hello !",
    });
  }

  public path() {
    const router = express.Router();
    router.use("/auth", authRouter);

    router.all("/*", (_req, res) => {
      return res.status(404).json({
        error: "Not Found",
      });
    });
    return router;
  }
}
