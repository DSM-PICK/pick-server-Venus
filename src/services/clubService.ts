import {
  ILogger,
  IClubRepository,
  IClub,
  IStudentRepository,
} from "../interfaces";
import { Club } from "../models";
import IClubLocationRepository from "../interfaces/IClubLocationRepository";
import { clubNotFoundError, invalidParameterError } from "../errors";

export default class ClubService {
  constructor(
    private clubRepository: IClubRepository,
    private clubLocationRepository: IClubLocationRepository,
    private studentRepository: IStudentRepository,
    private logger: ILogger
  ) {}

  public getClubs(): Promise<Club[]> {
    return this.clubRepository.findAll();
  }

  public async getClubByNameWithStudents(clubName: string) {
    if (!(await this.clubRepository.findClubByName(clubName))) {
      throw clubNotFoundError;
    }
    const club = await this.clubRepository.findClubByNameWithLocation(clubName);
    const students = await this.studentRepository.findStudentsByClubName(
      clubName
    );
    return {
      club,
      students,
    };
  }

  public async addClub(club: IClub): Promise<Club> {
    if (
      (await this.clubLocationRepository.isNotExistLocation(club.location)) ||
      (await this.clubRepository.findClubByName(club.name)) ||
      (await this.clubRepository.findClubByLocation(club.location))
    ) {
      throw invalidParameterError;
    }
    return this.clubRepository.addClub(club);
  }

  public async deleteClub(clubName: string): Promise<void> {
    if (!(await this.clubRepository.findClubByName(clubName))) {
      throw clubNotFoundError;
    }
    await this.clubRepository.deleteClubByName(clubName);
  }
}
