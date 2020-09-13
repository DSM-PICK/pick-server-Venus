import { expect } from "chai";

import { ClubService } from "../services";
import {
  fakeLogger,
  FakeClubRepository,
  FakeStudentRepository,
  FakeClubLocationRepository,
} from "./fakes";
import { Club } from "../models";
import { clubNotFoundError, invalidParameterError } from "../errors";
import { exampleClubLocations, exampleClubs, exampleStudents } from "./samples";

const clubRepository = FakeClubRepository.default;
const clubLocationRepository = FakeClubLocationRepository.default;
const studentRepository = FakeStudentRepository.default;
clubRepository.setClubLocationRepository(clubLocationRepository);
const clubService = new ClubService(
  clubRepository,
  clubLocationRepository,
  studentRepository,
  fakeLogger
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
          floor: 2,
          priority: 1,
        },
        {
          name: "Up",
          location: "보안 2실",
          floor: 3,
          priority: 0,
        },
        {
          name: "팬텀",
          location: "소개 2실",
          floor: 2,
          priority: 0,
        },
      ];
      expect(clubs).to.deep.equal(expectedResult);
    });
  });

  describe("addClub()", () => {
    it("should add club", async () => {
      const club: Club = { name: "ImagineClub", location: "보안 1실" };
      const expectedResult = [
        {
          floor: 2,
          location: "소개 3실",
          name: "Entry",
          priority: 1,
        },
        {
          floor: 3,
          location: "보안 1실",
          name: "ImagineClub",
          priority: 1,
        },
        {
          floor: 3,
          location: "보안 2실",
          name: "Up",
          priority: 0,
        },
        {
          floor: 2,
          location: "소개 2실",
          name: "팬텀",
          priority: 0,
        },
      ];

      expect(await clubService.addClub(club)).to.deep.equal(club);
      expect(await clubService.getClubs()).to.deep.equal(expectedResult);
    });

    it("should throw invalid parameter error with existing name", async () => {
      const club: Club = { name: "Entry", location: "보안 1실" };
      await expect(clubService.addClub(club)).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should throw invalid parameter error with nonexistent location", async () => {
      const club: Club = { name: "ImagineClub", location: "세미나실 3-2" };
      await expect(clubService.addClub(club)).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should throw invalid parameter error with occupied location", async () => {
      const club: Club = { name: "ImagineClub", location: "소개 2실" };
      await expect(clubService.addClub(club)).to.be.rejectedWith(
        invalidParameterError
      );
    });
  });

  describe("deleteClub()", () => {
    it("should delete club", async () => {
      const deletedName = "팬텀";
      const expectedResult = [
        {
          floor: 2,
          location: "소개 3실",
          name: "Entry",
          priority: 1,
        },
        {
          floor: 3,
          location: "보안 2실",
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
});
