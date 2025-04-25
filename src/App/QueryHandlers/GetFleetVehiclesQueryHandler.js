class GetFleetVehiclesQueryHandler {
  constructor(vehicleRepository, fleetRepository) {
    this.vehicleRepository = vehicleRepository;
    this.fleetRepository = fleetRepository;
  }

  async execute(query) {
    const { fleetId } = query;
    const fleet = await this.fleetRepository.findById(fleetId);
    if (!fleet) {
      throw new Error(`Fleet ${fleetId} not found`);
    }

    try {
      const vehicles = await Promise.all(
        fleet.vehicleIds.map((vehicleId) => {
          const vehicle = this.vehicleRepository.findById(vehicleId);
          if (!vehicle) {
            throw new Error(
              `Vehicle ${vehicleId} not found in fleet ${fleetId}`
            );
          }
          return vehicle;
        })
      );

      return vehicles.map((vehicle) => ({
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        location: vehicle.currentLocation && {
          latitude: vehicle.currentLocation.latitude,
          longitude: vehicle.currentLocation.longitude,
        },
      }));
    } catch (error) {
      throw new Error(
        `Failed to get vehicles for fleet ID ${fleetId}: ${error.message}`
      );
    }
  }
}

module.exports = GetFleetVehiclesQueryHandler;
