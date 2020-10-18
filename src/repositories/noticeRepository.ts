import { EntityRepository, Repository } from "typeorm";
import { Notice } from "../models";
import { INoticeRepository } from "../interfaces";

@EntityRepository(Notice)
export default class NoticeRepository extends Repository<Notice>
  implements INoticeRepository {
  public async addNotice(
    adminId: string,
    category: string,
    content: string
  ): Promise<void> {
    try {
      const newNotice = this.create({
        admin_id: adminId,
        content,
        category,
        created_at: new Date(),
      });
      await this.save(newNotice);
    } catch (e) {
      console.log(e);
      // TODO 에러 처리
    }
  }
}
