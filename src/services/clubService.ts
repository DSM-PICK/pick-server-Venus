import {
  Club,
  ClubLocationRepository,
  ClubRepository,
  GetClubsResponse,
  StudentRepository,
  UpdateClubRequest,
} from "../interfaces";
import {
  clubLocationNotFoundError,
  clubNotFoundError,
  invalidParameterError,
  locationAlreadyAssignedError,
} from "../errors";

export default class ClubService {
  constructor(
    private clubRepository: ClubRepository,
    private clubLocationRepository: ClubLocationRepository,
    private studentRepository: StudentRepository
  ) {}

  public getClubs(): Promise<GetClubsResponse[]> {
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

  public async addClub(club: Club, studentsNum: string[]): Promise<Club> {
    if (
      (await this.clubLocationRepository.isNotExistLocation(club.location)) ||
      (await this.clubRepository.findClubByName(club.name)) ||
      (await this.clubRepository.findClubByLocation(club.location))
    ) {
      throw invalidParameterError;
    }
    const createdClub = await this.clubRepository.addClub(club);
    if (studentsNum.length) {
      await this.studentRepository.updateStudentClub(club.name, studentsNum);
    }
    return createdClub;
  }

  public async deleteClub(clubName: string): Promise<void> {
    if (!(await this.clubRepository.findClubByName(clubName))) {
      throw clubNotFoundError;
    }
    await this.studentRepository.updateStudentClubToSelfStudy(clubName);
    await this.clubRepository.deleteClubByName(clubName);
  }

  public async updateClubInformation(
    clubName: string,
    club: UpdateClubRequest
  ) {
    if (!(await this.clubRepository.findClubByName(clubName))) {
      throw clubNotFoundError;
    }
    const existentInfo = {};
    let existentInfoCount = 0;
    for (let infoWillChange in club) {
      if (
        club.hasOwnProperty(infoWillChange) &&
        (infoWillChange === "teacher" ||
          infoWillChange === "club_head" ||
          club[infoWillChange])
      ) {
        existentInfoCount++;
        existentInfo[infoWillChange] = club[infoWillChange];
      }
    }
    if (!existentInfoCount) {
      throw invalidParameterError;
    }
    if (club.location) {
      if (await this.clubLocationRepository.isNotExistLocation(club.location)) {
        throw clubLocationNotFoundError;
      }
      if (await this.clubRepository.isAssignedLocation(club.location)) {
        throw locationAlreadyAssignedError;
      }
    }
    await this.clubRepository.updateClub(clubName, existentInfo);
  }

  public async getClubByName(name: string) {
    const club = await this.clubRepository.findClubByName(name);
    if (!club) {
      throw clubNotFoundError;
    }
    return club;
  }
}
