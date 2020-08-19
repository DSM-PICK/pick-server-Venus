import { Club } from "../models";

export default interface IClubRepository {
  findAll(): Promise<Club[]>;
  addClub(club: Club): Promise<Club>;
}
