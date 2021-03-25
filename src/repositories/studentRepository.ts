import { EntityRepository, Repository } from "typeorm";

import { Student } from "../models";
import { StudentRepository } from "../interfaces";

@EntityRepository(Student)
export default class StudentRepositoryImpl extends Repository<Student>
  implements StudentRepository {
  findStudentsByName(name: string): Promise<Student[]> {
    return this.createQueryBuilder("student")
      .select("student.club_name")
      .where("student.name LIKE :name", {
        name: `%${name}%`,
      })
      .groupBy("student.club_name")
      .getMany();
  }

  public findStudentsByClubName(clubName: string): Promise<Student[]> {
    return this.find({ club_name: clubName });
  }

  public async updateStudentClub(
    toClubName: string,
    studentsNum: string[]
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(Student)
      .set({ club_name: toClubName })
      .where("num IN (:num)", { num: studentsNum })
      .execute();
  }

  public findStudentsByNumAndName(numAndName: string): Promise<Student[]> {
    return this.createQueryBuilder()
      .where("CONCAT(num, ' ', name) LIKE :numAndName", {
        numAndName: `%${numAndName}%`,
      })
      .getMany();
  }

  public findStudentsByNums(nums: string[]): Promise<Student[]> {
    return this.createQueryBuilder()
      .where("num IN (:nums)", { nums })
      .getMany();
  }

  public async updateStudentClubToSelfStudy(clubName: string): Promise<void> {
    await this.update({ club_name: clubName }, { club_name: "창조실" });
  }
}
