export default interface TeacherRepository {
  findTeachersByName(name: string);
  updateManagedClub(name: string, clubName: string);
}
