import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import isAuth from "../middlewares/tokenVerification";
import { LocationService } from "../../services";
import { ClubLocationRepository } from "../../repositories";
import validate, { Property } from "../middlewares/paramValidation";
import { getLocationsSearchSchema } from "../middlewares/paramValidation/schema";

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

  route.get(
    "/search",
    isAuth,
    validate({ schema: getLocationsSearchSchema, property: Property.QUERY }),
    async (req: Request, res: Response, next: NextFunction) => {
      const { location } = req.query;
      try {
        const searchResult = await locationService.getLocationsByLocation(
          location as string
        );
        res.status(200).json(searchResult);
      } catch (e) {
        next(e);
      }
    }
  );
};
