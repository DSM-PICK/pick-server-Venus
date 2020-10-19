import { IClubRepository, IStudentRepository } from "../interfaces";
import { clubNotFoundError } from "../errors";
import { Student } from "../models";

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

  public getStudentsByNums(nums: string[]) {
    return this.studentRepository.findStudentsByNums(nums);
  }

  public getStudentsByNumAndName(numAndName: string): Promise<Student[]> {
    return this.studentRepository.findStudentsByNumAndName(numAndName);
  }
}
