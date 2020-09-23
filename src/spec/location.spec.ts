import { expect } from "chai";

import { FakeClubLocationRepository } from "./fakes";
import LocationService from "../services/locationService";
import { exampleClubLocations } from "./samples";

describe("LocationService", () => {
  const clubLocationRepository = FakeClubLocationRepository.default;
  const locationService = new LocationService(clubLocationRepository);

  describe("getLocations()", () => {
    it("should return all locations", async () => {
      const locations = await locationService.getLocations();

      expect(locations).to.deep.equal([
        { floor: 3, location: "보안 1실", priority: 1 },
      ]);
    });
  });
});
