import { Club } from "../models";
import IClub from "./IClub";

export default interface IClubRepository {
  findAll(): Promise<Club[]>;
  addClub(club: IClub): Promise<Club>;
  getClubByName(name: string): Promise<Club>;
  getClubByLocation(location: string): Promise<Club>;
}
