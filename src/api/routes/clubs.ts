import { Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import ClubController from "../../controllers/club";

const route = Router();

export default (app: Router) => {
  app.use("/clubs", route);

  route.get("/", isAuth, tryCatchHandler(ClubController.getAllClubs));
};
