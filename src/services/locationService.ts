import { ClubLocationRepository } from "../interfaces";

export default class LocationService {
  constructor(private clubLocationRepository: ClubLocationRepository) {}

  public getLocations() {
    return this.clubLocationRepository.findAll();
  }

  public getLocationsByLocation(location: string) {
    return this.clubLocationRepository.findAllByLocation(location);
  }
}
