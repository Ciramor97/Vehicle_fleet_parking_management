const VehicleRepository = require('../../Domain/Repositories/VehicleRepository');

class InMemoryVehicleRepository extends VehicleRepository {
  constructor() {
    super();
    this.vehicles = new Map();
  }

  save(vehicle) {
    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  }

  findById(id) {
    return this.vehicles.get(id) || null;
  }

  findByPlateNumber(plateNumber) {
    for (const vehicle of this.vehicles.values()) {
      if (vehicle.plateNumber === plateNumber) {
        return vehicle;
      }
    }
    return null;
  }
}

module.exports = InMemoryVehicleRepository;
