import { EventEmitter } from "events";

import { INoticeRepository, IUpdateClub } from "../interfaces";
import { Club } from "../models";

const eventEmitter = new EventEmitter();

export const studentClubChange = Symbol("studentClubChange");
export const clubDelete = Symbol("clubDelete");
export const clubAdd = Symbol("clubAdd");
export const clubInfoChange = Symbol("clubInfoChange");

export default (noticeRepository: INoticeRepository) => {
  eventEmitter.on(
    studentClubChange,
    async (from: string, to: string, students: string[], adminId: string) => {
      await noticeRepository.addNotice(
        adminId,
        "member",
        `${students.join(", ")} 학생이 ${from}에서 ${to}(으)로 이동했습니다.`
      );
    }
  );

  eventEmitter.on(
    clubDelete,
    async (club: string, clubLocation: string, adminId: string) => {
      await noticeRepository.addNotice(
        adminId,
        "club",
        `${club}이 제거되었습니다. (${clubLocation})`
      );
    }
  );

  eventEmitter.on(
    clubAdd,
    async (club: string, clubLocation: string, adminId: string) => {
      await noticeRepository.addNotice(
        adminId,
        "club",
        `${club}이 생성되었습니다. (${clubLocation})`
      );
    }
  );

  eventEmitter.on(
    clubInfoChange,
    async (beforeClub: Club, afterClub: IUpdateClub, adminId: string) => {
      await noticeRepository.addNoticeWhenClubInfoChange(
        adminId,
        beforeClub,
        afterClub
      );
    }
  );

  return eventEmitter;
};
