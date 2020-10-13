import { EntityRepository, Repository } from "typeorm";

import { Club, Student } from "../models";
import { IStudentRepository } from "../interfaces";
import { clubNotFoundError } from "../errors";

@EntityRepository(Student)
export default class StudentRepository extends Repository<Student>
  implements IStudentRepository {
  public findStudentsByClubName(clubName: string): Promise<Student[]> {
    return this.find({ club_name: clubName });
  }

  public async updateStudentClub(
    toClubName: string,
    studentsNum: string[]
  ): Promise<void> {
    const club = await this.createQueryBuilder()
      .where("club.name = :clubName", { clubName: toClubName })
      .getOne();
    if (!club) {
      throw clubNotFoundError;
    }
    await this.createQueryBuilder()
      .update(Student)
      .set({ class_name: toClubName })
      .where("num IN (:num)", { num: studentsNum })
      .execute();
  }

  public findStudentsByNumAndName(numAndName: string): Promise<Student[]> {
    return this.createQueryBuilder()
      .select()
      .from(Student, "student")
      .where("CONCAT(num, ' ', name) LIKE '%:numAndName%'", { numAndName })
      .getMany();
  }
}
