import ClubLocationRepository from "../../interfaces/club/ClubLocationRepository";
import { ClubLocation } from "../../models";
import FakeClubRepository from "./FakeClubRepository";

export default class FakeClubLocationRepository
  implements ClubLocationRepository {
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

  public async findAll(): Promise<ClubLocation[]> {
    const clubs = await FakeClubRepository.default.findAll();
    return this.clubLocations.filter(
      (clubLocation) =>
        clubs.findIndex((club) => club.location === clubLocation.location) ===
        -1
    );
  }

  public findAllByLocation(location: string): Promise<ClubLocation[]> {
    return new Promise<ClubLocation[]>((resolve) => {
      resolve(
        this.clubLocations.filter((clubLocation) => {
          return clubLocation.location.split(location).length !== 1;
        })
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
