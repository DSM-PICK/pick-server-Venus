import { getCustomRepository } from "typeorm";
import { ClubLocationRepositoryImpl } from "../repositories";
import { LocationService } from "../services";
import { NextFunction, Request, Response } from "express";

export default class LocationController {
  private clubLocationRepository = getCustomRepository(
    ClubLocationRepositoryImpl
  );
  private locationService = new LocationService(this.clubLocationRepository);

  public getAllLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const clubs = await this.locationService.getLocations();
    res.status(200).json(clubs);
  };

  public searchLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { location } = req.query;
    const searchResult = await this.locationService.getLocationsByLocation(
      location as string
    );
    res.status(200).json(searchResult);
  };
}
