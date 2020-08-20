import { EntityRepository, Repository } from "typeorm";
import { ClubLocation } from "../models";
import IClubLocationRepository from "../interfaces/IClubLocationRepository";

@EntityRepository(ClubLocation)
export default class ClubLocationRepository extends Repository<ClubLocation>
  implements IClubLocationRepository {
  public async isNotExistLocation(location: string): Promise<boolean> {
    const check = await this.findOne({ location });
    return !check;
  }
}
