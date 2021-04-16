import TeacherRepository from "../interfaces/teacher/TeacherRepository";

export default class TeacherService {
  constructor(private teacherRepository: TeacherRepository) {}

  public findTeachersByName(name: string) {
    return this.teacherRepository.findTeachersByName(name);
  }
}
