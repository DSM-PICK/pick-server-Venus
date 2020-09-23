import { IClubRepository, IStudentRepository } from "../interfaces";
import { clubNotFoundError } from "../errors";

export default class StudentService {
  constructor(
    private studentRepository: IStudentRepository,
    private clubRepository: IClubRepository
  ) {}

  public async updateStudentClub(
    toClubName: string,
    studentsNum: string[]
  ): Promise<void> {
    if (!(await this.clubRepository.findClubByName(toClubName))) {
      throw clubNotFoundError;
    }
    await this.studentRepository.updateStudentClub(toClubName, studentsNum);
  }
}