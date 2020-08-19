import { IClubRepository } from "../../interfaces";
import { Club } from "../../models";

export default class FakeClubRepository implements IClubRepository {
  private clubs: Club[] = [];

  public findAll(): Promise<Club[]> {
    return new Promise<Club[]>((resolve, reject) => {
      resolve(this.clubs);
    });
  }

  public addClub(club: Club): Promise<Club> {
    return new Promise<Club>((resolve, reject) => {
      this.clubs.push(club);
      resolve(club);
    });
  }

  public clear(): void {
    this.clubs = [];
  }
}
