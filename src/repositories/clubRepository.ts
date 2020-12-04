import { EntityRepository, Repository } from "typeorm";
import { Club, ClubLocation } from "../models";
import {
  ClubFromORM,
  ClubRepository,
  GetClubsResponse,
  UpdateClubRequest,
} from "../interfaces";

@EntityRepository(Club)
export default class ClubRepositoryImpl extends Repository<Club>
  implements ClubRepository {
  public async findAll(): Promise<GetClubsResponse[]> {
    const clubs = await this.findAllClubs();
    return ClubRepositoryImpl.formatGetClubsResponse(clubs);
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
  ): Promise<GetClubsResponse> {
    return ClubRepositoryImpl.formatGetClubNameResponse(
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

  public async updateClub(
    clubName: string,
    club: UpdateClubRequest
  ): Promise<void> {
    await this.update({ name: clubName }, { ...club });
  }

  public async isAssignedLocation(location: string): Promise<boolean> {
    return Boolean(await this.findOne({ location }));
  }

  private findAllClubs(): Promise<ClubFromORM[]> {
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
    clubs: ClubFromORM[]
  ): GetClubsResponse[] {
    return clubs.map((club) => this.defineGetClubsResponseFormat(club));
  }

  private static formatGetClubNameResponse(
    club: ClubFromORM
  ): GetClubsResponse {
    return this.defineGetClubsResponseFormat(club);
  }

  private static defineGetClubsResponseFormat({
    club_club_head,
    club_teacher,
    club_location,
    club_name,
    clubLocation_floor,
    clubLocation_priority,
  }: ClubFromORM) {
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
