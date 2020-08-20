import { EntityRepository, Repository } from "typeorm";
import { Club } from "../models";
import { IClub, IClubRepository } from "../interfaces";

@EntityRepository(Club)
export default class ClubRepository extends Repository<Club>
  implements IClubRepository {
  public findAll(): Promise<Club[]> {
    return this.find();
  }

  public addClub(club: IClub): Promise<Club> {
    return this.save(club);
  }

  public getClubByLocation(location: string): Promise<Club> {
    return this.findOne({ location });
  }

  public getClubByName(name: string): Promise<Club> {
    return this.findOne({ name });
  }
}
