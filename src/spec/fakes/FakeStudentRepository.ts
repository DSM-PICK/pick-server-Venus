import { IStudentRepository } from "../../interfaces";
import { Student } from "../../models";

export default class FakeStudentRepository implements IStudentRepository {
  private static _default: FakeStudentRepository;
  private students: Student[] = [];

  public static get default(): FakeStudentRepository {
    if (!FakeStudentRepository._default) {
      FakeStudentRepository._default = new FakeStudentRepository();
    }
    return FakeStudentRepository._default;
  }

  public findStudentsByClubName(clubName: string): Promise<Student[]> {
    return new Promise((resolve) => {
      resolve(
        this.students.filter((student) => student.club_name === clubName)
      );
    });
  }

  public updateStudentClub(
    toClubName: string,
    studentsNum: string[]
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.students = this.students.map((student) => {
        if (studentsNum.indexOf(student.num) !== -1) {
          return {
            ...student,
            club_name: toClubName,
          };
        }
        return student;
      });
      resolve();
    });
  }

  public findStudentsByNumAndName(numAndName: string): Promise<Student[]> {
    return new Promise<Student[]>((resolve) => {
      resolve(
        this.students.filter((student) => {
          const { num, name } = student;
          const numName = num + " " + name;
          return numName.split(numAndName).length !== 1;
        })
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
