import { IClubRepository, IGetClubsResponse } from "../../interfaces";
import { Club } from "../../models";
import FakeClubLocationRepository from "./FakeClubLocationRepository";

export default class FakeClubRepository implements IClubRepository {
  private static _default: FakeClubRepository;
  private clubs: Club[] = [];
  private clubLocationRepository: FakeClubLocationRepository;

  public static get default(): FakeClubRepository {
    if (!FakeClubRepository._default) {
      FakeClubRepository._default = new FakeClubRepository();
    }
    return FakeClubRepository._default;
  }

  public setClubLocationRepository(
    clubLocationRepository: FakeClubLocationRepository
  ) {
    this.clubLocationRepository = clubLocationRepository;
  }

  public findAll(): Promise<IGetClubsResponse[]> {
    return new Promise<IGetClubsResponse[]>((resolve, reject) => {
      const clubLocations = this.clubLocationRepository.getLocations();
      const response: IGetClubsResponse[] = this.clubs.map((club) => {
        for (let clubLocation of clubLocations) {
          if (clubLocation.location === club.location) {
            return {
              ...club,
              ...clubLocation,
            };
          }
        }
      });
      response.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      resolve(response);
    });
  }

  public addClub(club: Club): Promise<Club> {
    return new Promise<Club>((resolve) => {
      this.clubs.push(club);
      resolve(club);
    });
  }

  public clear(): void {
    this.clubs = [];
  }

  public findClubByLocation(location: string): Promise<Club> {
    return new Promise<Club>((resolve) => {
      resolve(this.clubs.find((club) => club.location === location));
    });
  }

  public findClubByName(name: string): Promise<Club> {
    return new Promise<Club>((resolve) => {
      resolve(this.clubs.find((club) => club.name === name));
    });
  }

  public findClubByNameWithLocation(name: string): Promise<IGetClubsResponse> {
    return new Promise<IGetClubsResponse>((resolve) => {
      const locations = this.clubLocationRepository.getLocations();
      const club = this.clubs.find((c) => c.name === name);
      for (let location of locations) {
        if (location.location === club.location) {
          resolve({ ...club, ...location });
        }
      }
    });
  }

  public deleteClubByName(name: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.clubs = this.clubs.filter((club) => club.name !== name);
      resolve();
    });
  }
}
