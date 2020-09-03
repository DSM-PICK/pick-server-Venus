import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import {
  IClubFromORM,
  IClubRepository,
  IGetClubsResponse,
} from "../interfaces";

@EntityRepository(Club)
export default class ClubRepository extends Repository<Club>
  implements IClubRepository {
  public async findAll(): Promise<IGetClubsResponse[]> {
    const clubs = await this.findAllClubs();
    return this.formatInResponseFormat(clubs);
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

  private findAllClubs(): Promise<IClubFromORM[]> {
    return this.createQueryBuilder("club")
      .leftJoinAndSelect(
        ClubLocation,
        "clubLocation",
        "club.location = clubLocation.location"
      )
      .orderBy("club.name", "ASC")
      .getRawMany();
  }

  private formatInResponseFormat(clubs: IClubFromORM[]): IGetClubsResponse[] {
    return clubs.map((club) => {
      const {
        club_location,
        club_name,
        clubLocation_floor,
        clubLocation_priority,
      } = club;
      const formatted: IGetClubsResponse = {} as IGetClubsResponse;
      Object.defineProperties(formatted, {
        name: {
          value: club_name,
          enumerable: true,
        },
        location: {
          value: club_location,
          enumerable: true,
        },
        floor: {
          value: clubLocation_floor,
          enumerable: true,
        },
        priority: {
          value: clubLocation_priority,
          enumerable: true,
        },
      });
      return formatted;
    });
  }
}
