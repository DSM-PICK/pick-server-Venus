import { expect } from "chai";

import { ClubService } from "../services";
import {
  FakeClubLocationRepository,
  FakeClubRepository,
  FakeStudentRepository,
} from "./fakes";
import { Club } from "../models";
import {
  clubLocationNotFoundError,
  clubNotFoundError,
  invalidParameterError,
  locationAlreadyAssignedError,
} from "../errors";
import { exampleClubLocations, exampleClubs, exampleStudents } from "./samples";
import { Club } from "../interfaces";

const clubRepository = FakeClubRepository.default;
const clubLocationRepository = FakeClubLocationRepository.default;
const studentRepository = FakeStudentRepository.default;
clubRepository.setClubLocationRepository(clubLocationRepository);
const clubService = new ClubService(
  clubRepository,
  clubLocationRepository,
  studentRepository
);

beforeEach(async () => {
  let jobs = [];
  exampleClubLocations.forEach((clubLocation) =>
    jobs.push(clubLocationRepository.addLocation(clubLocation))
  );
  exampleStudents.forEach((student) =>
    jobs.push(studentRepository.addStudent(student))
  );
  exampleClubs.forEach((club) => jobs.push(clubRepository.addClub(club)));
  await Promise.all(jobs);
});

afterEach(() => {
  clubRepository.clear();
  studentRepository.clear();
  clubLocationRepository.clear();
});

describe("ClubService", () => {
  describe("getClubs()", () => {
    it("should return all club", async () => {
      const clubs = await clubService.getClubs();
      const expectedResult = [
        {
          name: "Entry",
          location: "소개 3실",
          teacher: "아무개",
          club_head: "대두",
          floor: 2,
          priority: 1,
        },
        {
          name: "Up",
          location: "보안 2실",
          teacher: "나미리",
          club_head: "치타",
          floor: 3,
          priority: 0,
        },
        {
          name: "팬텀",
          location: "소개 2실",
          teacher: "채성아",
          club_head: "철수",
          floor: 2,
          priority: 0,
        },
      ];
      expect(clubs).to.deep.equal(expectedResult);
    });
  });

  describe("addClub()", () => {
    it("should add club", async () => {
      const club: Club = {
        name: "ImagineClub",
        location: "보안 1실",
        teacher: "두목",
        club_head: "킹갓",
      };
      const expectedResult = [
        {
          floor: 2,
          location: "소개 3실",
          teacher: "아무개",
          club_head: "대두",
          name: "Entry",
          priority: 1,
        },
        {
          floor: 3,
          location: "보안 1실",
          teacher: "두목",
          club_head: "킹갓",
          name: "ImagineClub",
          priority: 1,
        },
        {
          floor: 3,
          location: "보안 2실",
          teacher: "나미리",
          club_head: "치타",
          name: "Up",
          priority: 0,
        },
        {
          floor: 2,
          location: "소개 2실",
          teacher: "채성아",
          club_head: "철수",
          name: "팬텀",
          priority: 0,
        },
      ];

      expect(await clubService.addClub(club, [])).to.deep.equal(club);
      expect(await clubService.getClubs()).to.deep.equal(expectedResult);
    });

    it("should throw invalid parameter error with existing name", async () => {
      const club: Club = {
        name: "Entry",
        location: "보안 1실",
        teacher: "선생님",
        club_head: "친구",
      };
      await expect(clubService.addClub(club, [])).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should throw invalid parameter error with nonexistent location", async () => {
      const club: Club = {
        name: "ImagineClub",
        location: "세미나실 3-2",
        teacher: "두목",
        club_head: "킹갓",
      };
      await expect(clubService.addClub(club, [])).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should throw invalid parameter error with occupied location", async () => {
      const club: Club = {
        name: "ImagineClub",
        location: "소개 2실",
        teacher: "두목",
        club_head: "킹갓",
      };
      await expect(clubService.addClub(club, [])).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should add club with students", async () => {
      const club: Club = {
        name: "ImagineClub",
        location: "보안 1실",
        teacher: "두목",
        club_head: "킹갓",
      };
      const studentsNum = ["1101", "2103", "2304"];

      await clubService.addClub(club, studentsNum);

      const result = await clubService.getClubByNameWithStudents("ImagineClub");
      expect(result).to.deep.equal({
        club: {
          name: "ImagineClub",
          location: "보안 1실",
          teacher: "두목",
          club_head: "킹갓",
          floor: 3,
          priority: 1,
        },
        students: [
          {
            name: "김김김",
            club_name: "ImagineClub",
            class_name: null,
            num: "1101",
          },
          {
            name: "황황황",
            club_name: "ImagineClub",
            class_name: null,
            num: "2103",
          },
          {
            name: "진진진",
            club_name: "ImagineClub",
            class_name: null,
            num: "2304",
          },
        ],
      });
    });
  });

  describe("deleteClub()", () => {
    it("should delete club", async () => {
      const deletedName = "팬텀";
      const expectedResult = [
        {
          floor: 2,
          location: "소개 3실",
          teacher: "아무개",
          club_head: "대두",
          name: "Entry",
          priority: 1,
        },
        {
          floor: 3,
          location: "보안 2실",
          teacher: "나미리",
          club_head: "치타",
          name: "Up",
          priority: 0,
        },
      ];

      await clubService.deleteClub(deletedName);
      expect(await clubService.getClubs()).to.deep.equal(expectedResult);
    });

    it("should throw club not found error", async () => {
      const nonexistentName = "스톤";
      await expect(clubService.deleteClub(nonexistentName)).to.be.rejectedWith(
        clubNotFoundError
      );
    });
  });

  describe("getClubByNameWithStudents()", () => {
    it("should return expected result", async () => {
      const clubName = "팬텀";
      const expectedResult = {
        club: {
          name: "팬텀",
          floor: 2,
          teacher: "채성아",
          club_head: "철수",
          location: "소개 2실",
          priority: 0,
        },
        students: exampleStudents.filter(
          (student) => student.club_name === clubName
        ),
      };

      const result = await clubService.getClubByNameWithStudents(clubName);
      expect(result).to.deep.equal(expectedResult);
    });

    it("should throw club not found error", async () => {
      const nonexistentClubName = "돌돌";
      await expect(
        clubService.getClubByNameWithStudents(nonexistentClubName)
      ).to.be.rejectedWith(clubNotFoundError);
    });

    it("should throw invalid parameter error", async () => {
      await expect(
        clubService.getClubByNameWithStudents("")
      ).to.be.rejectedWith(clubNotFoundError);
    });
  });

  describe("updateClubInformation()", () => {
    it("should update club information", async () => {
      const clubName = "Up";
      const clubInformation = {
        name: "Down",
        club_head: "짱구",
      } as Club;

      await clubService.updateClubInformation(clubName, clubInformation);

      const updatedInformation = await clubService.getClubByNameWithStudents(
        clubInformation.name
      );
      delete updatedInformation.students;
      expect(updatedInformation.club).to.deep.equal({
        floor: 3,
        location: "보안 2실",
        teacher: "나미리",
        club_head: "짱구",
        name: "Down",
        priority: 0,
      });
    });

    it("should update club location", async () => {
      const clubName = "Up";
      const clubInformation = { location: "보안 1실" };

      await clubService.updateClubInformation(clubName, clubInformation);

      const updatedInformation = await clubService.getClubByNameWithStudents(
        clubName
      );
      delete updatedInformation.students;
      expect(updatedInformation.club).to.deep.equal({
        floor: 3,
        location: "보안 1실",
        teacher: "나미리",
        club_head: "치타",
        name: "Up",
        priority: 1,
      });
    });

    it("should throw invalid parameter error with empty object", async () => {
      const clubName = "Up";
      const clubInformation = {};

      await expect(
        clubService.updateClubInformation(clubName, clubInformation)
      ).to.be.rejectedWith(invalidParameterError);
    });

    it("should throw club not found error with nonexistent club name", async () => {
      const clubName = "nonexistence";
      const clubInformation = { name: "existence" };

      await expect(
        clubService.updateClubInformation(clubName, clubInformation)
      ).to.be.rejectedWith(clubNotFoundError);
    });

    it("should throw club location not found error with nonexistent club location", async () => {
      const clubName = "Up";
      const clubInformation = { location: "소개 100실" };

      await expect(
        clubService.updateClubInformation(clubName, clubInformation)
      ).to.be.rejectedWith(clubLocationNotFoundError);
    });

    it("should throw location already assigned error", async () => {
      const clubName = "Up";
      const clubInformation = { location: "소개 2실" };

      await expect(
        clubService.updateClubInformation(clubName, clubInformation)
      ).to.be.rejectedWith(locationAlreadyAssignedError);
    });
  });

  describe("getClubByName()", () => {
    it("should return expected club information", async () => {
      const clubName = "Up";

      const club = await clubService.getClubByName(clubName);

      expect(club).to.deep.equal({
        name: "Up",
        location: "보안 2실",
        teacher: "나미리",
        club_head: "치타",
      });
    });

    it("should throw club not found error with nonexistent club name", async () => {
      const clubName = "xxxx";

      await expect(clubService.getClubByName(clubName)).to.be.rejectedWith(
        clubNotFoundError
      );
    });
  });
});
