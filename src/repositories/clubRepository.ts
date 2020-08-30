import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import { IClubRepository } from "../interfaces";

@EntityRepository(Club)
export default class ClubRepository extends Repository<Club>
  implements IClubRepository {
  public async findAll(): Promise<Club[]> {
    return (
      await this.createQueryBuilder("club")
        .leftJoinAndSelect(
          ClubLocation,
          "clubLocation",
          "club.location = clubLocation.location"
        )
        .getRawMany()
    ).map((club) => {
      const obj: Club = {} as Club;
      Object.defineProperties(obj, {
        name: {
          value: club.club_name,
          enumerable: true,
        },
        location: {
          value: club.club_location,
          enumerable: true,
        },
        floor: {
          value: club.clubLocation_floor,
          enumerable: true,
        },
        priority: {
          value: club.clubLocation_priority,
          enumerable: true,
        },
      });
      return obj;
    });
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

  public async deleteClubByName(name: string): Promise<void> {
    await this.delete({ name });
  }
}
