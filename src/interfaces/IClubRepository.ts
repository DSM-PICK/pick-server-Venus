import { Club } from "../models";
import IGetClubsResponse from "./IGetClubsResponse";

export default interface IClubRepository {
  findAll(): Promise<IGetClubsResponse[]>;
  addClub(club: Club): Promise<Club>;
  getClubByName(name: string): Promise<Club>;
  getClubByLocation(location: string): Promise<Club>;
  deleteClubByName(name: string): Promise<void>;
}
