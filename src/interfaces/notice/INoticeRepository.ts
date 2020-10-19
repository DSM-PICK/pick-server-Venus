import { IUpdateClub } from "../club";
import { Club } from "../../models";

export default interface INoticeRepository {
  addNotice(adminId: string, category: string, content: string): Promise<void>;
  addNoticeWhenClubInfoChange(
    adminId: string,
    beforeClub: Club,
    afterClub: IUpdateClub
  ): Promise<void>;
}
