import { Student } from "../../models";

export default interface IStudentRepository {
  findStudentsByClubName(clubName: string): Promise<Student[]>;
  updateStudentClub(toClubName: string, studentsNum: string[]): Promise<void>;
}
