import { Club } from "../../models";
import GetClubsResponse from "../other/GetClubsResponse";
import UpdateClubRequest from "./UpdateClubRequest";

export default interface ClubRepository {
  findAll(): Promise<GetClubsResponse[]>;
  addClub(club: Club): Promise<Club>;
  findClubByName(name: string): Promise<Club>;
  findClubByLocation(location: string): Promise<Club>;
  findClubByNameWithLocation(name: string): Promise<GetClubsResponse>;
  deleteClubByName(name: string): Promise<void>;
  updateClub(clubName: string, club: UpdateClubRequest): Promise<void>;
  isAssignedLocation(location: string): Promise<boolean>;
}
