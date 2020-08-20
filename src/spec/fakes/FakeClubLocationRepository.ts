import IClubLocationRepository from "../../interfaces/IClubLocationRepository";
import { ClubLocation } from "../../models";

export default class FakeClubLocationRepository
  implements IClubLocationRepository {
  private clubLocations: ClubLocation[] = [];

  public isNotExistLocation(location: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      resolve(
        !this.clubLocations.find(
          (clubLocation) => clubLocation.location === location
        )
      );
    });
  }

  public addLocation(location: ClubLocation): void {
    this.clubLocations.push(location);
  }

  public clear(): void {
    this.clubLocations = [];
  }
}
