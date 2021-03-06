import { EntityRepository, Repository } from "typeorm";
import * as moment from "moment";

import { Club, Notice } from "../models";
import { NoticeRepository, UpdateClubRequest } from "../interfaces";
import logger from "../loaders/logger";

@EntityRepository(Notice)
export default class NoticeRepositoryImpl extends Repository<Notice>
  implements NoticeRepository {
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
        created_at: moment().tz("Asia/Seoul").toDate(),
      });

      await this.save(newNotice);
    } catch (e) {
      logger.error(e);
    }
  }

  public async addNoticeWhenClubInfoChange(
    adminId: string,
    beforeClub: Club,
    afterClub: UpdateClubRequest
  ): Promise<void> {
    const tasks = [];
    try {
      for (let prop in afterClub) {
        if (afterClub.hasOwnProperty(prop) && afterClub[prop]) {
          const content = NoticeRepositoryImpl.makeContentByProperty(
            prop,
            beforeClub,
            afterClub
          );
          const notice = this.create({
            admin_id: adminId,
            content,
            category: "club",
            created_at: moment().tz("Asia/Seoul").toDate(),
          });
          tasks.push(this.save(notice));
        }
      }
      await Promise.all(tasks);
    } catch (e) {
      logger.error(e);
    }
  }

  private static makeContentByProperty(
    prop: string,
    beforeClub: Club,
    afterClub: UpdateClubRequest
  ): string {
    let content: string;
    switch (prop) {
      case "name":
        content = `${beforeClub.name} 동아리명이 ${afterClub.name}(으)로 변경되었습니다.`;
        break;
      case "location":
        content = `${beforeClub.name}이 ${beforeClub.location}에서 ${afterClub.location}(으)로 이동했습니다.`;
        break;
      case "teacher":
        content = `${beforeClub.name} 동아리 담당 선생님이 ${beforeClub.teacher} 선생님에서 ${afterClub.teacher} 선생님으로 변경되었습니다.`;
        break;
      case "club_head":
        content = `${beforeClub.name} 동아리의 부장이 ${beforeClub.club_head} 학생에서 ${afterClub.club_head} 학생으로 변경되었습니다.`;
        break;
      default:
    }
    return content;
  }
}
