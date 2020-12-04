import { getCustomRepository } from "typeorm";
import { ClubLocationRepository } from "../repositories";
import { LocationService } from "../services";
import { NextFunction, Request, Response } from "express";

export default class LocationController {
  static clubLocationRepository = getCustomRepository(ClubLocationRepository);
  static locationService = new LocationService(
    LocationController.clubLocationRepository
  );

  static getAllLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const clubs = await LocationController.locationService.getLocations();
    res.status(200).json(clubs);
  };

  static searchLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { location } = req.query;
    const searchResult = await LocationController.locationService.getLocationsByLocation(
      location as string
    );
    res.status(200).json(searchResult);
  };
}
