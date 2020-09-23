import { ClubLocation } from "../../models";

export default interface IClubRepository {
  isNotExistLocation(location: string): Promise<boolean>;
  findAll(): Promise<ClubLocation[]>;
}
