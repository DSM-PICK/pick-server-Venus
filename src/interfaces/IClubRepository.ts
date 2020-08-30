import { Club } from "../models";
import IClub from "./IClub";

export default interface IClubRepository {
  findAll(): Promise<Club[]>;
  addClub(club: Club): Promise<Club>;
  getClubByName(name: string): Promise<Club>;
  getClubByLocation(location: string): Promise<Club>;
  deleteClubByName(name: string): Promise<void>;
}
