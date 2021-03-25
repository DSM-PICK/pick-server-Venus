import { Student } from "../../models";

export default interface StudentRepository {
  findStudentsByClubName(clubName: string): Promise<Student[]>;
  updateStudentClub(toClubName: string, studentsNum: string[]): Promise<void>;
  findStudentsByNumAndName(numAndName: string): Promise<Student[]>;
  findStudentsByNums(nums: string[]): Promise<Student[]>;
  updateStudentClubToSelfStudy(clubName: string): Promise<void>;
  findStudentsByName(name: string): Promise<Student[]>;
}
