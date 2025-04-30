const { v4: uuidv4 } = require('uuid');

//factories
const FleetFactory = require('./src/Domain/Factories/FleetFactory');
const VehicleFactory = require('./src/Domain/Factories/VehicleFactory');

// memory repositories
const InMemoryFleetRepository = require('./src/Infra/Repositories/InMemoryFleetRepository');
const InMemoryVehicleRepository = require('./src/Infra/Repositories/InMemoryVehicleRepository');

// sqlite repositories
// const SQLiteFleetRepository = require("./src/Infra/Repositories/SQLiteFleetRepository");
// const SQLiteVehicleRepository = require("./src/Infra/Repositories/SqLiteVehicleRepository");

// commands
const RegisterVehicleCommand = require('./src/App/Commands/RegisterVehicleCommand');
const ParkVehicleCommand = require('./src/App/Commands/ParkVehicleCommand');
// command handlers
const RegisterVehicleCommandHandler = require('./src/App/CommandHandlers/RegisterVehicleCommandHandler');
const ParkVehicleCommandHandler = require('./src/App/CommandHandlers/ParkVehicleCommandHandler');

//create repositories
const vehicleRepository = new InMemoryVehicleRepository();
const fleetRepository = new InMemoryFleetRepository();

// use sqlite repositories instead of in-memory for persistent storage
// const vehicleRepository = new SQLiteVehicleRepository();
// const fleetRepository = new SQLiteFleetRepository();

//create command handlers
const registerVehicleCommandHandler = new RegisterVehicleCommandHandler(
  vehicleRepository,
  fleetRepository
);
const parkVehicleCommandHandler = new ParkVehicleCommandHandler(
  vehicleRepository,
  fleetRepository
);

async function registerVehicleIntoFleet(vehicleId, fleetId) {
  try {
    const registerVehicleCommand = new RegisterVehicleCommand(
      fleetId,
      vehicleId
    );
    await registerVehicleCommandHandler.execute(registerVehicleCommand);
    console.log(`Registered vehicle ${vehicleId} to fleet ${fleetId}`);
  } catch (error) {
    console.error(`Failed to register vehicle: ${error.message}`);
  }
}

async function parkVehicleInFleet(vehicleId, fleetId, latitude, longitude) {
  try {
    const parkVehicleCommand = new ParkVehicleCommand(
      fleetId,
      vehicleId,
      latitude,
      longitude
    );
    await parkVehicleCommandHandler.execute(parkVehicleCommand);
    console.log(
      `Parked vehicle ${vehicleId} in fleet ${fleetId} at location (${latitude}, ${longitude})`
    );
  } catch (error) {
    console.error(`Failed to park vehicle: ${error.message}`);
  }
}

async function main() {
  console.log('Vehicle fleet parking management demo started.');

  // await initDatabase();
  const userId = uuidv4();
  console.log(`Created user with ID: ${userId}`);

  // Create a fleet for the user
  const fleetId = uuidv4();
  const fleet = FleetFactory.create(fleetId, userId);
  await fleetRepository.save(fleet);
  console.log(`Created fleet with ID: ${fleetId} for user: ${userId}`);

  // Create a vehicle
  const vehicleId = uuidv4();
  const plateNumber = 'ABC123';
  const vehicle = VehicleFactory.create(vehicleId, plateNumber);
  await vehicleRepository.save(vehicle);
  console.log(`Created vehicle with ID: ${vehicleId}`);

  // Register the vehicle to the fleet
  await registerVehicleIntoFleet(vehicleId, fleetId);

  // Park the vehicle in the fleet
  const latitude = 40.7128;
  const longitude = -74.006;
  await parkVehicleInFleet(vehicleId, fleetId, latitude, longitude);

  // Try to park the same vehicle in the same location (should fail)
  await parkVehicleInFleet(vehicleId, fleetId, latitude, longitude);

  // Try to park the vehicle in a different location
  const newLatitude = 34.0522;
  const newLongitude = -118.2437;
  await parkVehicleInFleet(vehicleId, fleetId, newLatitude, newLongitude);
}

main()
  .then(() => {
    console.log('Demo completed successfully.');
  })
  .catch((error) => {
    console.error('Demo failed:', error);
  });
