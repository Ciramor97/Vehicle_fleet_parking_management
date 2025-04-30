const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");

Given("a location", function () {
  this.location = this.createLocation(48.8584, 2.2945);
});

Given("my vehicle has been parked into this location", async function () {
  await this.parkVehicle(
    this.myFleetId,
    this.vehicleId,
    this.location.getLatitude(),
    this.location.getLongitude(),
  );
});

When("I park my vehicle at this location", async function () {
  await this.parkVehicle(
    this.myFleetId,
    this.vehicleId,
    this.location.getLatitude(),
    this.location.getLongitude(),
  );
});

When("I try to park my vehicle at this location", async function () {
  await this.parkVehicle(
    this.myFleetId,
    this.vehicleId,
    this.location.getLatitude(),
    this.location.getLongitude(),
  );
});

Then(
  "the known location of my vehicle should verify this location",
  async function () {
    const vehicle = await this.getVehicleById(this.vehicleId);

    expect(vehicle.currentLocation).to.not.be.null;
    expect(vehicle.currentLocation.getLatitude()).to.equal(
      this.location.getLatitude(),
    );
  },
);

Then(
  "I should be informed that my vehicle is already parked at this location",
  function () {
    expect(this.error).to.not.be.null;
    expect(this.error.message).to.include("already parked");
  },
);
