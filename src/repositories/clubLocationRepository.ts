import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import { IClubLocationRepository } from "../interfaces";

@EntityRepository(ClubLocation)
export default class ClubLocationRepository extends Repository<ClubLocation>
  implements IClubLocationRepository {
  public async isNotExistLocation(location: string): Promise<boolean> {
    const check = await this.findOne({ location });
    return !check;
  }

  public async findAll(): Promise<ClubLocation[]> {
    const assignedLocations = (
      await this.createQueryBuilder("clubLocation")
        .innerJoin(Club, "club", "club.location = clubLocation.location")
        .printSql()
        .getMany()
    ).map((location) => location.location);

    return this.createQueryBuilder()
      .where("location NOT IN (:locations)", { locations: assignedLocations })
      .getMany();
  }
}
