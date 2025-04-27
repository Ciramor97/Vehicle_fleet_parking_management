const Location = require("../../Domain/ValueObjects/Location");
const {
  VehicleNotInFleetException,
  VehicleAlreadyParkedHereException,
} = require("../../Domain/Exceptions/DomainException");

class ParkVehicleCommandHandler {
  constructor(vehicleRepository, fleetRepository) {
    this.vehicleRepository = vehicleRepository;
    this.fleetRepository = fleetRepository;
  }

  async execute(command) {
    const { fleetId, vehicleId, latitude, longitude } = command;

    const location = new Location(latitude, longitude);

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

    if (!vehicle.isInFleet(fleet.id)) {
      throw new VehicleNotInFleetException(vehicle.id, fleet.id);
    }

    if (vehicle.currentLocation && vehicle.currentLocation.equals(location)) {
      throw new VehicleAlreadyParkedHereException(
        vehicleId,
        location.toString()
      );
    }

    vehicle.parkAt(location, fleetId);
    await this.vehicleRepository.save(vehicle);
    return { success: true };
  }
}

module.exports = ParkVehicleCommandHandler;
