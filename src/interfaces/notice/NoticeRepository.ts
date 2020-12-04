import { UpdateClubRequest } from "../club";
import { Club } from "../../models";

export default interface NoticeRepository {
  addNotice(adminId: string, category: string, content: string): Promise<void>;
  addNoticeWhenClubInfoChange(
    adminId: string,
    beforeClub: Club,
    afterClub: UpdateClubRequest
  ): Promise<void>;
}
