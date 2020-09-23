import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import isAuth from "../middlewares/tokenVerification";
import { LocationService } from "../../services";
import { ClubLocationRepository } from "../../repositories";

const route = Router();

export default (app: Router) => {
  app.use("/locations", route);

  const clubLocationRepository = getCustomRepository(ClubLocationRepository);
  const locationService = new LocationService(clubLocationRepository);

  route.get(
    "/",
    isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const clubs = await locationService.getLocations();
        res.status(200).json(clubs);
      } catch (e) {
        next(e);
      }
    }
  );
};
