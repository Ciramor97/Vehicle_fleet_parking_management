const Vehicle = require('../Models/Vehicle');

class VehicleFactory {
  static create(id, plateNumber) {
    return new Vehicle(id, plateNumber);
  }
}

module.exports = VehicleFactory;
