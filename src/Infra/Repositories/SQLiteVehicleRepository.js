const Vehicle = require('../../Domain/Models/Vehicle');
const VehicleRepository = require('../../Domain/Repositories/VehicleRepository');
const sqlite3 = require('sqlite3').verbose();

class SQLiteVehicleRepository extends VehicleRepository {
  constructor(dbPath = './parking.db') {
    super();
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database ' + err.message);
      } else {
        this.createTables();
      }
    });
  }

  createTables() {
    this.db.serialize(() => {
      this.db.run(`
            CREATE TABLE IF NOT EXISTS vehicles (
              id TEXT PRIMARY KEY,
              plateNumber TEXT,
              currentLocation TEXT
            )
          `);

      this.db.run(`
            CREATE TABLE IF NOT EXISTS fleet_vehicles (
              vehicleId TEXT,
              fleetId TEXT,
              PRIMARY KEY (vehicleId, fleetId),
              FOREIGN KEY (vehicleId) REFERENCES vehicles(id),
              FOREIGN KEY (fleetId) REFERENCES fleets(id)
            )
          `);
    });
  }
  async save(vehicle) {
    await new Promise((resolve, reject) => {
      const sql = `INSERT INTO vehicles (id, plateNumber, currentLocation) VALUES (?, ?, ?)`;
      this.db.run(
        sql,
        [vehicle.id, vehicle.plateNumber, vehicle.currentLocation],
        (err) => (err ? reject(err) : resolve())
      );
    });

    await new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM fleet_vehicles WHERE vehicleId = ?`,
        [vehicle._id],
        (err) => (err ? reject(err) : resolve())
      );
    });

    for (const fleetId of vehicle.fleetIds) {
      await new Promise((resolve, reject) => {
        this.db.run(
          `INSERT INTO fleet_vehicles (vehicleId, fleetId) VALUES (?, ?)`,
          [vehicle._id, fleetId],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    return vehicle;
  }

  async findById(id) {
    const vehicleRow = await new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM vehicles WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    });

    if (!vehicleRow) return null;

    const fleetIds = await new Promise((resolve, reject) => {
      this.db.all(
        `SELECT fleetId FROM fleet_vehicles WHERE vehicleId = ?`,
        [id],
        (err, rows) => (err ? reject(err) : resolve(rows.map((r) => r.fleetId)))
      );
    });

    const vehicle = new Vehicle(vehicleRow.id, vehicleRow.plateNumber);
    vehicle._currentLocation = vehicleRow.currentLocation;
    vehicle._fleetIds = new Set(fleetIds);

    return vehicle;
  }

  async findByPlateNumber(plateNumber) {
    const row = await new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM vehicles WHERE plateNumber = ?`,
        [plateNumber],
        (err, r) => (err ? reject(err) : resolve(r))
      );
    });

    return row ? this.findById(row.id) : null;
  }
}

module.exports = SQLiteVehicleRepository;
