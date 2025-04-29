const { setWorldConstructor } = require("@cucumber/cucumber");
const { v4: uuidv4 } = require("uuid");
const InMemoryVehicleRepository = require("../../src/Infra/Repositories/InMemoryVehicleRepository");
const InMemoryFleetRepository = require("../../src/Infra/Repositories/InMemoryFleetRepository");
const RegisterVehicleCommand = require("../../src/App/Commands/RegisterVehicleCommand");
const RegisterVehicleCommandHandler = require("../../src/App/CommandHandlers/RegisterVehicleCommandHandler");
const ParkVehicleCommandHandler = require("../../src/App/CommandHandlers/ParkVehicleCommandHandler");
const FleetFactory = require("../../src/Domain/Factories/FleetFactory");
const VehicleFactory = require("../../src/Domain/Factories/VehicleFactory");
const ParkVehicleCommand = require("../../src/App/Commands/ParkVehicleCommand");
const Location = require("../../src/Domain/ValueObjects/Location");

class FleetParkingWorld {
  constructor() {
    this.vehicleRepository = new InMemoryVehicleRepository();
    this.fleetRepository = new InMemoryFleetRepository();

    this.registerVehicleHandler = new RegisterVehicleCommandHandler(
      this.vehicleRepository,
      this.fleetRepository
    );

    this.parkVehicleHandler = new ParkVehicleCommandHandler(
      this.vehicleRepository,
      this.fleetRepository
    );

    this.myUserId = uuidv4();
    this.myFleetId = uuidv4();
    this.vehicleId = uuidv4();
    this.location = null;
    this.error = null;
  }

  async createMyFleet(fleetId, userId) {
    const fleet = FleetFactory.create(fleetId, userId);

    await this.fleetRepository.save(fleet);
    return fleet;
  }

  async createVehicle() {
    this.vehicleId = uuidv4();
    const plateNumber = "TEST123";

    const vehicle = VehicleFactory.create(this.vehicleId, plateNumber);

    await this.vehicleRepository.save(vehicle);
    return vehicle;
  }

  async registerVehicle(fleetId, vehicleId) {
    try {
      const command = new RegisterVehicleCommand(fleetId, vehicleId);
      await this.registerVehicleHandler.execute(command);
    } catch (err) {
      this.error = err;
    }
  }

  async parkVehicle(fleetId, vehicleId, latitude, longitude) {
    try {
      const command = new ParkVehicleCommand(
        fleetId,
        vehicleId,
        latitude,
        longitude
      );
      await this.parkVehicleHandler.execute(command);
    } catch (err) {
      this.error = err;
    }
  }
  async getVehicleById(vehicleId) {
    return await this.vehicleRepository.findById(vehicleId);
  }

  async getFleetById(fleetId) {
    return await this.fleetRepository.findById(fleetId);
  }

  createLocation(latitude, longitude) {
    this.location = new Location(latitude, longitude);
    return this.location;
  }
}
setWorldConstructor(FleetParkingWorld);
