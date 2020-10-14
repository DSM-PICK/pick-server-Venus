import { expect } from "chai";

import { FakeClubLocationRepository } from "./fakes";
import LocationService from "../services/locationService";
import { exampleClubLocations } from "./samples";

describe("LocationService", () => {
  const clubLocationRepository = FakeClubLocationRepository.default;
  const locationService = new LocationService(clubLocationRepository);

  describe("getLocations()", () => {
    it("should return all locations that is not assigned to club", async () => {
      const locations = await locationService.getLocations();

      expect(locations).to.deep.equal([
        { floor: 3, location: "보안 1실", priority: 1 },
      ]);
    });
  });

  describe("getLocationsByLocation", () => {
    it("should return expected locations by location", async () => {
      const location = "소개";
      const searchResult = await locationService.getLocationsByLocation(
        location
      );

      expect(searchResult).to.deep.equal([
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
      ]);
    });

    it("should return expected locations by location 2", async () => {
      const location = "2";
      const searchResult = await locationService.getLocationsByLocation(
        location
      );

      expect(searchResult).to.deep.equal([
        {
          location: "소개 2실",
          floor: 2,
          priority: 0,
        },
        {
          location: "보안 2실",
          floor: 3,
          priority: 0,
        },
      ]);
    });
  });
});
