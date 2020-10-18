import { EventEmitter } from "events";

import { INoticeRepository } from "../interfaces";

const eventEmitter = new EventEmitter();

export const studentClubChange = Symbol("studentClubChange");
export const clubDelete = Symbol("clubDelete");
export const clubAdd = Symbol("clubAdd");
export const clubLocationChange = Symbol("clubLocationChange");

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
    clubLocationChange,
    async (club: string, from: string, to: string, adminId: string) => {
      await noticeRepository.addNotice(
        adminId,
        "club",
        `${club}이 ${from}에서 ${to}로 이동하였습니다.`
      );
    }
  );

  return eventEmitter;
};
