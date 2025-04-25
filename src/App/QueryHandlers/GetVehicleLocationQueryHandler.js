const {
  VehicleNotInFleetException,
} = require("../../Domain/Exceptions/DomainException");

class GetVehicleLocationQueryHandler {
  constructor(vehicleRepository, fleetRepository) {
    this.vehicleRepository = vehicleRepository;
    this.fleetRepository = fleetRepository;
  }

  async execute(query) {
    const { vehicleId, fleetId } = query;

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

    if (!vehicle.isInFleet(fleetId) || !fleet.hasVehicle(vehicleId)) {
      throw new VehicleNotInFleetException(vehicleId, fleetId);
    }

    return (
      vehicle.currentLocation && {
        vehicleId,
        latitude: vehicle.currentLocation.latitude,
        longitude: vehicle.currentLocation.longitude,
      }
    );
  }
}

module.exports = GetVehicleLocationQueryHandler;
