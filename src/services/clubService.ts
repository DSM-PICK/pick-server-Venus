import { ILogger, IClubRepository, IClub } from "../interfaces";
import { Club } from "../models";
import IClubLocationRepository from "../interfaces/IClubLocationRepository";
import { invalidParameterError } from "../errors";

export default class ClubService {
  constructor(
    private clubRepository: IClubRepository,
    private clubLocationRepository: IClubLocationRepository,
    private logger: ILogger
  ) {}

  public getClubs(): Promise<Club[]> {
    return this.clubRepository.findAll();
  }

  public async addClub(club: IClub): Promise<Club> {
    if (
      (await this.clubLocationRepository.isNotExistLocation(club.location)) ||
      (await this.clubRepository.getClubByName(club.name)) ||
      (await this.clubRepository.getClubByLocation(club.location))
    ) {
      throw invalidParameterError;
    }
    return this.clubRepository.addClub(club);
  }
}
