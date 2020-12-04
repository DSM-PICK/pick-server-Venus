import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import { ClubLocationRepository } from "../interfaces";

@EntityRepository(ClubLocation)
export default class ClubLocationRepositoryImpl extends Repository<ClubLocation>
  implements ClubLocationRepository {
  public async isNotExistLocation(location: string): Promise<boolean> {
    const check = await this.findOne({ location });
    return !check;
  }

  public async findAll(): Promise<ClubLocation[]> {
    const assignedLocations = await this.findAssignedLocationsName();

    return this.createQueryBuilder()
      .where("location NOT IN (:locations)", { locations: assignedLocations })
      .getMany();
  }

  public async findAllByLocation(location: string): Promise<ClubLocation[]> {
    const assignedLocations = await this.findAssignedLocationsName();

    return this.createQueryBuilder()
      .where("location NOT IN (:locations)", { locations: assignedLocations })
      .andWhere("location LIKE :location", { location: `%${location}%` })
      .getMany();
  }

  private async findAssignedLocationsName(): Promise<string[]> {
    return (
      await this.createQueryBuilder("clubLocation")
        .innerJoin(Club, "club", "club.location = clubLocation.location")
        .getMany()
    ).map((location) => location.location);
  }
}
