const {
  VehicleAlreadyRegisteredException,
} = require("../../Domain/Exceptions/DomainException");

class RegisterVehicleCommandHandler {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
    this.fleetRepository = fleetRepository;
  }

  async execute(command) {
    const { vehicleId, fleetId } = command;

    const [fleet, vehicle] = await Promise.all([
      this.fleetRepository.findById(fleetId),
      this.vehicleRepository.findById(vehicleId),
    ]);

    if (!vehicle) {
      throw new Error(`Vehicle ${vehicleId} not found`);
    }
    if (!fleet) {
      throw new Error(`Fleet ${fleetId} not found`);
    }

    // Check if the vehicle is already in the fleet
    if (fleet.hasVehicle(vehicleId)) {
      throw new VehicleAlreadyRegisteredException(vehicleId, fleetId);
    }

    fleet.registerVehicle(vehicleId);
    vehicle.registerToFleet(fleetId);

    // TODO: use transaction
    await this.vehicleRepository.save(vehicle);
    await this.fleetRepository.save(fleet);

    return { success: true };
  }
}

module.exports = RegisterVehicleCommandHandler;
