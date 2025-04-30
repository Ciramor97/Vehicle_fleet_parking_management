//localize on planet earth
class Location {
  constructor(latitude, longitude) {
    this._latitude = parseFloat(latitude);
    this._longitude = parseFloat(longitude);

    if (isNaN(this._latitude) || isNaN(this._longitude)) {
      throw new Error('Location requires valid numeric coordinates');
    }
    if (this._latitude < -90 || this._latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }
    if (this._longitude < -180 || this._longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees');
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
      this._latitude === other.getLatitude() &&
      this._longitude === other.getLongitude()
    );
  }

  toString() {
    return `(${this._latitude}, ${this._longitude})`;
  }
}

module.exports = Location;
