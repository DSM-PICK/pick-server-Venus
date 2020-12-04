import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import isAuth from "../middlewares/tokenVerification";
import ClubRepository from "../../repositories/clubRepository";
import ClubService from "../../services/clubService";
import { ClubLocationRepository, StudentRepository } from "../../repositories";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import ClubController from "../../controllers/club";

const route = Router();

export default (app: Router) => {
  app.use("/clubs", route);

  route.get("/", isAuth, tryCatchHandler(ClubController.getAllClubs));
};
