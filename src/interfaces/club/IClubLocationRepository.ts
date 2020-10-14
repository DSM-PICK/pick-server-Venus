import { ClubLocation } from "../../models";

export default interface IClubLocationRepository {
  isNotExistLocation(location: string): Promise<boolean>;
  findAll(): Promise<ClubLocation[]>;
  findAllByLocation(location: string): Promise<ClubLocation[]>;
}
