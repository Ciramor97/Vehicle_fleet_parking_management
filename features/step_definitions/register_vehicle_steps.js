const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");

const { v4: uuidv4 } = require("uuid");

let otherUserId;
let otherFleetId;

Given("my fleet", async function () {
  await this.createMyFleet(this.myFleetId, this.myUserId);
});

Given("a vehicle", async function () {
  await this.createVehicle();
});

Given("the fleet of another user", async function () {
  otherUserId = uuidv4();
  otherFleetId = uuidv4();
  await this.createMyFleet(otherFleetId, otherUserId);
});

Given("I have registered this vehicle into my fleet", async function () {
  await this.registerVehicle(this.myFleetId, this.vehicleId);
});

When("I register this vehicle into my fleet", async function () {
  await this.registerVehicle(this.myFleetId, this.vehicleId);
});

When("I try to register this vehicle into my fleet", async function () {
  await this.registerVehicle(this.myFleetId, this.vehicleId);
});

When(
  "this vehicle has been registered into the other user's fleet",
  async function () {
    await this.registerVehicle(otherFleetId, this.vehicleId);
  },
);

Then("this vehicle should be part of my vehicle fleet", async function () {
  const fleet = await this.getFleetById(this.myFleetId);
  const vehicle = await this.getVehicleById(this.vehicleId);

  expect(fleet.hasVehicle(this.vehicleId)).to.be.true;

  expect(vehicle.isInFleet(this.myFleetId)).to.be.true;
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function () {
    expect(this.error).to.not.be.null;
    expect(this.error.message).to.include("already");
  },
);

Then("Register same vehicle to two different fleet", async function () {
  const fleet = await this.fleetRepository.getFleetById(otherFleetId);
  expect(fleet.hasVehicle(this.vehicleId)).to.be.true;

  const vehicle = await this.vehicleRepository.getVehicleById(this.vehicleId);
  expect(vehicle.isInFleet(otherFleetId)).to.be.true;
});
