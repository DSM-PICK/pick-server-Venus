import { Router } from "express";

import isAuth from "../middlewares/tokenVerification";
import validate, { Property } from "../middlewares/paramValidation";
import { getLocationsSearchSchema } from "../middlewares/paramValidation/schema";
import tryCatchHandler from "../middlewares/tryCatchHandler";
import LocationController from "../../controllers/location";

const route = Router();

export default (app: Router) => {
  const locationController = new LocationController();

  app.use("/locations", route);

  route.get("/", isAuth, tryCatchHandler(locationController.getAllLocations));

  route.get(
    "/search",
    isAuth,
    validate({ schema: getLocationsSearchSchema, property: Property.QUERY }),
    tryCatchHandler(locationController.searchLocations)
  );
};
