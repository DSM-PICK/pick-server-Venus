import { NextFunction, Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";

import isAuth from "../middlewares/tokenVerification";
import { LocationService } from "../../services";
import { ClubLocationRepository } from "../../repositories";
import validate, { Property } from "../middlewares/paramValidation";
import { getLocationsSearchSchema } from "../middlewares/paramValidation/schema";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import LocationController from "../../controllers/location";

const route = Router();

export default (app: Router) => {
  app.use("/locations", route);

  route.get("/", isAuth, tryCatchHandler(LocationController.getAllLocations));

  route.get(
    "/search",
    isAuth,
    validate({ schema: getLocationsSearchSchema, property: Property.QUERY }),
    tryCatchHandler(LocationController.searchLocations)
  );
};
