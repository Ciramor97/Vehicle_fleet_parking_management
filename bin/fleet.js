#!/usr/bin/env node

const { program } = require("commander");
const { v4: uuidv4 } = require("uuid");

const FleetFactory = require("../src/Domain/Factories/FleetFactory");
const VehicleFactory = require("../src/Domain/Factories/VehicleFactory");

const RegisterVehicleCommand = require("../src/App/Commands/RegisterVehicleCommand");
const ParkVehicleCommand = require("../src/App/Commands/ParkVehicleCommand");
const RegisterVehicleCommandHandler = require("../src/App/CommandHandlers/RegisterVehicleCommandHandler");
const ParkVehicleCommandHandler = require("../src/App/CommandHandlers/ParkVehicleCommandHandler");

const InMemoryFleetRepository = require("../src/Infra/Repositories/InMemoryFleetRepository");
const InMemoryVehicleRepository = require("../src/Infra/Repositories/InMemoryVehicleRepository");

// Create repositories
const fleetRepository = new InMemoryFleetRepository();
const vehicleRepository = new InMemoryVehicleRepository();

// Create command handlers
const registerVehicleHandler = new RegisterVehicleCommandHandler(
  vehicleRepository,
  fleetRepository
);
const parkVehicleHandler = new ParkVehicleCommandHandler(
  vehicleRepository,
  fleetRepository
);

program
  .name("fleet")
  .description("Vehicle fleet parking management CLI")
  .version("1.0.0");

program
  .command("create")
  .description("Create a new fleet for a user")
  .argument("<userId>", "ID of the user who owns the fleet")
  .action(async (userId) => {
    try {
      const fleetId = uuidv4();
      const fleet = FleetFactory.create(fleetId, userId);
      await fleetRepository.save(fleet);
      console.log(fleetId);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

program
  .command("register-vehicle")
  .description("Register a vehicle to a fleet")
  .argument("<fleetId>", "ID of the fleet")
  .argument("<vehiclePlateNumber>", "Vehicle plate number")
  .action(async (fleetId, vehiclePlateNumber) => {
    try {
      const vehicleId = uuidv4();
      const vehicle = VehicleFactory.create(vehicleId, vehiclePlateNumber);
      await vehicleRepository.save(vehicle);

      const command = new RegisterVehicleCommand(fleetId, vehicleId);
      await registerVehicleHandler.execute(command);

      console.log(
        `Vehicle ${vehiclePlateNumber} registered to fleet ${fleetId}`
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

program
  .command("localize-vehicle")
  .description("Set the location of a vehicle")
  .argument("<fleetId>", "ID of the fleet")
  .argument("<vehiclePlateNumber>", "Vehicle plate number")
  .argument("<lat>", "Latitude")
  .argument("<lng>", "Longitude")
  .action(async (fleetId, vehiclePlateNumber, lat, lng) => {
    try {
      const vehicle = await vehicleRepository.findByPlateNumber(
        vehiclePlateNumber
      );
      if (!vehicle) {
        throw new Error(
          `Vehicle with plate number ${vehiclePlateNumber} not found`
        );
      }

      const command = new ParkVehicleCommand(
        fleetId,
        vehicle.id,
        parseFloat(lat),
        parseFloat(lng)
      );
      await parkVehicleHandler.execute(command);

      console.log(
        `Vehicle ${vehiclePlateNumber} localized at (${lat}, ${lng})`
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

program.parse();
