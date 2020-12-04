import { expect } from "chai";

import { FakeClubRepository, FakeStudentRepository } from "./fakes";
import StudentService from "../services/studentService";
import { clubNotFoundError, invalidParameterError } from "../errors";

describe("StudentService", () => {
  const studentRepository = FakeStudentRepository.default;
  const clubRepository = FakeClubRepository.default;
  const studentService = new StudentService(studentRepository, clubRepository);

  describe("updateStudentClub()", () => {
    it("should update student's club", async () => {
      const toClubName = "팬텀";
      const studentsNum = ["1403", "2304"];

      await studentService.updateStudentClub(toClubName, studentsNum);

      const result = await studentRepository.findStudentsByClubName(toClubName);

      expect(result).to.deep.equal([
        {
          name: "김김김",
          club_name: "팬텀",
          class_name: null,
          num: "1101",
        },
        {
          name: "박박박",
          club_name: "팬텀",
          class_name: null,
          num: "1202",
        },
        {
          name: "최최최",
          club_name: "팬텀",
          class_name: null,
          num: "1301",
        },
        {
          name: "황황황",
          club_name: "팬텀",
          class_name: null,
          num: "1403",
        },
        {
          name: "진진진",
          club_name: "팬텀",
          class_name: null,
          num: "2304",
        },
      ]);
    });

    it("should throw club not found error", async () => {
      const toClubName = "상상동아리";
      const studentsNum = ["1403", "2304"];

      await expect(
        studentService.updateStudentClub(toClubName, studentsNum)
      ).to.be.rejectedWith(clubNotFoundError);
    });

    it("should throw invalid parameter error without studentsNum", async () => {
      const toClubName = "팬텀";

      await expect(
        studentService.updateStudentClub(toClubName, [])
      ).to.be.rejectedWith(invalidParameterError);
    });
  });

  describe("getStudentsByNumAndName()", () => {
    it("should return expected search result", async () => {
      const numAndName = "12";
      const searchResult = await studentService.getStudentsByNumAndName(
        numAndName
      );

      expect(searchResult).to.deep.equal([
        {
          name: "이이이",
          club_name: "Entry",
          class_name: null,
          num: "1201",
        },
        {
          name: "박박박",
          club_name: "팬텀",
          class_name: null,
          num: "1202",
        },
      ]);
    });
  });

  describe("getStudentsByNums()", () => {
    it("should return expected students data with nums", async () => {
      const nums = ["1101", "1301", "2304"];

      const students = await studentService.getStudentsByNums(nums);

      expect(students).to.deep.equal([
        {
          name: "김김김",
          club_name: "팬텀",
          class_name: null,
          num: "1101",
        },
        {
          name: "최최최",
          club_name: "팬텀",
          class_name: null,
          num: "1301",
        },
        {
          name: "진진진",
          club_name: "Entry",
          class_name: null,
          num: "2304",
        },
      ]);
    });
  });
});
