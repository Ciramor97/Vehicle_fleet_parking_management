class Vehicle {
  constructor(id, plateNumber) {
    if (!id || !plateNumber) {
      throw new Error("Vehicle requires an id and a plate number");
    }
    this._id = id;
    this._plateNumber = plateNumber;
    this._curentLocation = null;
    this._fleetIds = new Set();
  }

  get id() {
    return this._id;
  }

  get plateNumber() {
    return this._plateNumber;
  }

  get currentLocation() {
    return this._currentLocation;
  }

  get fleetIds() {
    return Array.from(this._fleetIds);
  }

  isInFleet(fleetId) {
    return this._fleetIds.has(fleetId);
  }

  registerToFleet(fleetId) {
    if (this.isInFleet(fleetId)) {
      throw new Error(`Vehicle is already registered to this fleet ${fleetId}`);
    }
    this._fleetIds.add(fleetId);
    return true;
  }

  parkAt(location, fleetId) {
    if (!this.isInFleet(fleetId)) {
      throw new Error(`Vehicle is not registered to this fleet ${fleetId}`);
    }

    if (!this.currentLocation || this.currentLocation.equals(location)) {
      throw new Error(`Vehicle is already parked at this location ${location}`);
    }
    this._currentLocation = location;
    return true;
  }
}

module.exports = Vehicle;
