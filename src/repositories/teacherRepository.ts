import { EntityRepository, Repository } from "typeorm";
import TeacherRepository from "../interfaces/teacher/TeacherRepository";
import { Teacher } from "../models/teacher";

@EntityRepository(Teacher)
export default class TeacherRepositoryImpl extends Repository<Teacher>
	implements TeacherRepository {

	public findTeachersByName(name: string) {
		return this.createQueryBuilder()
			.where('name LIKE :name', { name: `%${name}%` })
			.getMany();
	}

	public updateManagedClub(name: string, clubName: string) {
		
	}
}