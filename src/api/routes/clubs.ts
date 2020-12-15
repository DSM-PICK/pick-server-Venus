import { Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import ClubController from "../../controllers/club";

const route = Router();

export default (app: Router) => {
  const clubController = new ClubController();

  app.use("/clubs", route);

  route.get("/", isAuth, tryCatchHandler(clubController.getAllClubs));
};
