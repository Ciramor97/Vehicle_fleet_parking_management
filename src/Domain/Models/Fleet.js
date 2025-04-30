class Fleet {
  constructor(id, userId) {
    if (!id || !userId) {
      throw new Error("Fleet id must be provided and userId must be provided");
    }
    this._id = id;
    this._userId = userId;
    this._vehicleIds = new Set();
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get vehicleIds() {
    return Array.from(this._vehicleIds);
  }

  hasVehicle(vehicleId) {
    return this._vehicleIds.has(vehicleId);
  }

  registerVehicle(vehicleId) {
    if (this.hasVehicle(vehicleId)) {
      throw new Error(
        `Vehicle ${vehicleId} is already registered to this fleet`,
      );
    }
    this._vehicleIds.add(vehicleId);
    return true;
  }
}

module.exports = Fleet;
