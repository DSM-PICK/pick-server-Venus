import { ClubLocation } from "../../models";

export default interface ClubLocationRepository {
  isNotExistLocation(location: string): Promise<boolean>;
  findAll(): Promise<ClubLocation[]>;
  findAllByLocation(location: string): Promise<ClubLocation[]>;
}
