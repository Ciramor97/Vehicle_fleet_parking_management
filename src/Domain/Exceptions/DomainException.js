class DomainException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class VehicleAlreadyRegisteredException extends DomainException {
  constructor(vehicleId, fleetId) {
    super(`Vehicle ${vehicleId} is already registered to fleet ${fleetId}`);
  }
}

class VehicleAlreadyParkedHereException extends DomainException {
  constructor(vehicleId, location) {
    super(`Vehicle ${vehicleId} is already parked at location ${location}`);
  }
}

class VehicleNotInFleetException extends DomainException {
  constructor(vehicleId, fleetId) {
    super(`Vehicle ${vehicleId} is not registered in fleet ${fleetId}`);
  }
}

module.exports = {
  DomainException,
  VehicleAlreadyRegisteredException,
  VehicleNotInFleetException,
  VehicleAlreadyParkedHereException
};
