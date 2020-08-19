import { ILogger, IClubRepository } from "../interfaces";

export default class ClubService {
  constructor(
    private clubRepository: IClubRepository,
    private logger: ILogger
  ) {}

  public getClubs() {
    return this.clubRepository.findAll();
  }
}
