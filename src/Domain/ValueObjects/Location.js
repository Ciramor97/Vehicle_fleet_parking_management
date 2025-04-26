//localize on planet earth
class Location {
  constructor(latitude, longitude) {
    this._latitude = latitude;
    this._longitude = longitude;

    if (isNaN(this._latitude) || isNaN(this._longitude)) {
      throw new Error("Location requires valid numeric coordinates");
    }
    if (this._latitude < -90 || this._latitude > 90) {
      throw new Error("Latitude must be between -90 and 90 degrees");
    }
    if (this._longitude < -180 || this._longitude > 180) {
      throw new Error("Longitude must be between -180 and 180 degrees");
    }

    Object.freeze(this);
  }

  getLatitude() {
    return this._latitude;
  }

  getLongitude() {
    return this._longitude;
  }

  equals(other) {
    if (!(other instanceof Location)) {
      return false;
    }

    return (
      this._latitude === other.latitude && this._longitude === other.longitude
    );
  }
}

module.exports = Location;
