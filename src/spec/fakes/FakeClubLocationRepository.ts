import IClubLocationRepository from "../../interfaces/club/IClubLocationRepository";
import { ClubLocation } from "../../models";

export default class FakeClubLocationRepository
  implements IClubLocationRepository {
  private static _default: FakeClubLocationRepository;
  private clubLocations: ClubLocation[] = [];

  public static get default(): FakeClubLocationRepository {
    if (!FakeClubLocationRepository._default) {
      FakeClubLocationRepository._default = new FakeClubLocationRepository();
    }
    return FakeClubLocationRepository._default;
  }

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

  public getLocations(): ClubLocation[] {
    return this.clubLocations;
  }
}
