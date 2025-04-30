const Fleet = require('../Models/Fleet');

class FleetFactory {
  static create(id, userId) {
    return new Fleet(id, userId);
  }
}

module.exports = FleetFactory;
