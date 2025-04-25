class InMemoryVehicleRepository {
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

  clear() {
    this.vehicles.clear();
  }
}

module.exports = InMemoryVehicleRepository;
