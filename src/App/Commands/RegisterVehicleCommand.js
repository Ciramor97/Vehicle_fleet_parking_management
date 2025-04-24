class RegisterVehicleCommand {
  constructor(fleetId, vehicleId) {
    this.fleetId = fleetId;
    this.vehicleId = vehicleId;
  }
}

module.exports = RegisterVehicleCommand;
