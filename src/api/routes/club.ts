import { Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/club", route);
};
