import { Club } from "../models";
import IGetClubsResponse from "./IGetClubsResponse";

export default interface IClubRepository {
  findAll(): Promise<IGetClubsResponse[]>;
  addClub(club: Club): Promise<Club>;
  findClubByName(name: string): Promise<Club>;
  findClubByLocation(location: string): Promise<Club>;
  findClubByNameWithLocation(name: string): Promise<IGetClubsResponse>;
  deleteClubByName(name: string): Promise<void>;
}
