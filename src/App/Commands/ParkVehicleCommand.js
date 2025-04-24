class ParkVehicleCommand {
  constructor(fleetId, vehicleId, latitude, longitude) {
    this.fleetId = fleetId;
    this.vehicleId = vehicleId;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}

module.exports = ParkVehicleCommand;
