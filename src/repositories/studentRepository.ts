import { EntityRepository, Repository } from "typeorm";

import { Student } from "../models";
import { IStudentRepository } from "../interfaces";

@EntityRepository(Student)
export default class StudentRepository extends Repository<Student>
  implements IStudentRepository {
  public findStudentsByClubName(clubName: string): Promise<Student[]> {
    return this.find({ club_name: clubName });
  }
}
