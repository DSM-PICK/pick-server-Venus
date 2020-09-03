import { expect } from "chai";

import { ClubService } from "../services";
import { fakeLogger, FakeClubRepository } from "./fakes";
import FakeClubLocationRepository from "./fakes/FakeClubLocationRepository";
import { Club, ClubLocation } from "../models";
import { clubNotFoundError, invalidParameterError } from "../errors";

describe("ClubService", () => {
  const clubRepository = new FakeClubRepository();
  const clubLocationRepository = new FakeClubLocationRepository();
  clubRepository.setClubLocationRepository(clubLocationRepository);
  const clubService = new ClubService(
    clubRepository,
    clubLocationRepository,
    fakeLogger
  );

  const exampleClubLocations: ClubLocation[] = [
    {
      location: "소개 2실",
      floor: 2,
      priority: 0,
    },
    {
      location: "소개 3실",
      floor: 2,
      priority: 1,
    },
    {
      location: "보안 2실",
      floor: 3,
      priority: 0,
    },
    {
      location: "보안 1실",
      floor: 3,
      priority: 1,
    },
  ];
  const exampleClubs: Club[] = [
    {
      name: "Entry",
      location: "소개 3실",
    },
    {
      name: "팬텀",
      location: "소개 2실",
    },
    {
      name: "Up",
      location: "보안 2실",
    },
  ];

  beforeEach(async () => {
    let jobs = [];
    exampleClubLocations.forEach((clubLocation) =>
      jobs.push(clubLocationRepository.addLocation(clubLocation))
    );
    exampleClubs.forEach((club) => jobs.push(clubRepository.addClub(club)));
    await Promise.all(jobs);
  });

  afterEach(() => {
    clubRepository.clear();
  });

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

    it("should throw invalid parameter error with existing name", () => {
      const club: Club = { name: "Entry", location: "보안 1실" };
      expect(clubService.addClub(club)).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should throw invalid parameter error with nonexistent location", () => {
      const club: Club = { name: "ImagineClub", location: "세미나실 3-2" };
      expect(clubService.addClub(club)).to.be.rejectedWith(
        invalidParameterError
      );
    });

    it("should throw invalid parameter error with occupied location", () => {
      const club: Club = { name: "ImagineClub", location: "소개 2실" };
      expect(clubService.addClub(club)).to.be.rejectedWith(
        invalidParameterError
      );
    });
  });

  describe("deleteClub", () => {
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

    it("should throw club not found error", () => {
      const nonexistentName = "스톤";
      expect(clubService.deleteClub(nonexistentName)).to.be.rejectedWith(
        clubNotFoundError
      );
    });
  });
});
