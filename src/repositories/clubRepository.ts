import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import { IClub, IClubRepository } from "../interfaces";

@EntityRepository(Club)
export default class ClubRepository extends Repository<Club>
  implements IClubRepository {
  public async findAll(): Promise<Club[]> {
    return this.find({ relations: ["clubLocation"] });
  }

  public addClub(club: Club): Promise<Club> {
    return this.save(club);
  }

  public getClubByLocation(location: string): Promise<Club> {
    return this.findOne({ location });
  }

  public getClubByName(name: string): Promise<Club> {
    return this.findOne({ name });
  }
}
