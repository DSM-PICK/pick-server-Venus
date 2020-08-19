import { expect } from "chai";

import { ClubService } from "../services";
import { fakeLogger, FakeClubRepository } from "./fakes";

describe("ClubService", () => {
  const clubRepository = new FakeClubRepository();
  const clubService = new ClubService(clubRepository, fakeLogger);
  const exampleClubs = [
    {
      name: "팬텀",
      floor: 2,
      location: "소개 2실",
      priority: 0,
    },
    {
      name: "Entry",
      floor: 2,
      location: "소개 3실",
      priority: 1,
    },
    {
      name: "Up",
      floor: 3,
      location: "보안 2실",
      priority: 0,
    },
  ];

  beforeEach(async () => {
    let jobs = [];
    exampleClubs.forEach((club) => jobs.push(clubRepository.addClub(club)));
    await Promise.all(jobs);
  });

  afterEach(() => {
    clubRepository.clear();
  });

  it("should return all club", async () => {
    const clubs = await clubService.getClubs();
    expect(clubs).to.deep.equal(exampleClubs);
  });
});
