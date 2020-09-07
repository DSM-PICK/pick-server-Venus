import { IStudentRepository } from "../../interfaces";
import { Student } from "../../models";

export default class FakeStudentRepository implements IStudentRepository {
  private students: Student[] = [];

  public findStudentsByClubName(clubName: string): Promise<Student[]> {
    return new Promise((resolve) => {
      resolve(
        this.students.filter((student) => student.club_name === clubName)
      );
    });
  }

  public addStudent(student: Student): void {
    this.students.push(student);
  }

  public clear(): void {
    this.students = [];
  }
}
