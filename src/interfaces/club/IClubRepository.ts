import { Club } from "../../models";
import IGetClubsResponse from "../other/IGetClubsResponse";
import IUpdateClub from "./IUpdateClub";

export default interface IClubRepository {
  findAll(): Promise<IGetClubsResponse[]>;
  addClub(club: Club): Promise<Club>;
  findClubByName(name: string): Promise<Club>;
  findClubByLocation(location: string): Promise<Club>;
  findClubByNameWithLocation(name: string): Promise<IGetClubsResponse>;
  deleteClubByName(name: string): Promise<void>;
  updateClub(clubName: string, club: IUpdateClub): Promise<void>;
  isAssignedLocation(location: string): Promise<boolean>;
}
