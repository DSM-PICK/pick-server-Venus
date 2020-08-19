import { EntityRepository, Repository } from "typeorm";
import { Club } from "../models";
import { IClubRepository } from "../interfaces";

@EntityRepository(Club)
export default class ClubRepository extends Repository<Club>
  implements IClubRepository {
  public findAll(): Promise<Club[]> {
    return this.find();
  }

  public addClub(club: Club): Promise<Club> {
    return this.save(club);
  }
}
