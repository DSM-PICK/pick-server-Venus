import { ClubRepository, StudentRepository, Student } from "../interfaces";
import { clubNotFoundError, invalidParameterError } from "../errors";

export default class StudentService {
  constructor(
    private studentRepository: StudentRepository,
    private clubRepository: ClubRepository
  ) {}

  public async updateStudentClub(
    toClubName: string,
    studentsNum: string[]
  ): Promise<void> {
    if (!(await this.clubRepository.findClubByName(toClubName))) {
      throw clubNotFoundError;
    }
    if (!studentsNum.length) {
      throw invalidParameterError;
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
