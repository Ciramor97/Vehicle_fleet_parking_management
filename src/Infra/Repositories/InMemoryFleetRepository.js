const FleetRepository = require("../../Domain/Repositories/FleetRepository");

class InMemoryFleetRepository extends FleetRepository {
  constructor() {
    super();
    this.fleets = new Map();
  }

  save(fleet) {
    this.fleets.set(fleet.id, fleet);
    return fleet;
  }

  findById(id) {
    return this.fleets.get(id) || null;
  }

  findByUserId(userId) {
    return Array.from(this.fleets.values()).filter(
      (fleet) => fleet.userId === userId
    );
  }

  clear() {
    this.fleets.clear();
  }
}

module.exports = InMemoryFleetRepository;
