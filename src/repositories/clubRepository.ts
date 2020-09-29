import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import {
  IClub,
  IClubFromORM,
  IClubRepository,
  IGetClubsResponse,
  IUpdateClub,
} from "../interfaces";

@EntityRepository(Club)
export default class ClubRepository extends Repository<Club>
  implements IClubRepository {
  public async findAll(): Promise<IGetClubsResponse[]> {
    const clubs = await this.findAllClubs();
    return ClubRepository.formatGetClubsResponse(clubs);
  }

  public addClub(club: Club): Promise<Club> {
    return this.save(club);
  }

  public findClubByLocation(location: string): Promise<Club> {
    return this.findOne({ location });
  }

  public findClubByName(name: string): Promise<Club> {
    return this.findOne({ name });
  }

  public async findClubByNameWithLocation(
    name: string
  ): Promise<IGetClubsResponse> {
    return ClubRepository.formatGetClubNameResponse(
      await this.createQueryBuilder("club")
        .leftJoinAndSelect(
          ClubLocation,
          "clubLocation",
          "club.location = clubLocation.location"
        )
        .where("name = :name", { name })
        .getRawOne()
    );
  }

  public async deleteClubByName(name: string): Promise<void> {
    await this.delete({ name });
  }

  public async updateClub(clubName: string, club: IUpdateClub): Promise<void> {
    await this.update({ name: clubName }, { ...club });
  }

  public async isAssignedLocation(location: string): Promise<boolean> {
    return Boolean(await this.findOne({ location }));
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

  private static formatGetClubsResponse(
    clubs: IClubFromORM[]
  ): IGetClubsResponse[] {
    return clubs.map((club) => this.defineGetClubsResponseFormat(club));
  }

  private static formatGetClubNameResponse(
    club: IClubFromORM
  ): IGetClubsResponse {
    return this.defineGetClubsResponseFormat(club);
  }

  private static defineGetClubsResponseFormat({
    club_club_head,
    club_teacher,
    club_location,
    club_name,
    clubLocation_floor,
    clubLocation_priority,
  }: IClubFromORM) {
    return Object.defineProperties(
      {},
      {
        name: {
          value: club_name,
          enumerable: true,
        },
        location: {
          value: club_location,
          enumerable: true,
        },
        teacher: {
          value: club_teacher,
          enumerable: true,
        },
        club_head: {
          value: club_club_head,
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
      }
    );
  }
}
