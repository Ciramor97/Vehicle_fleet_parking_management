const sqlite3 = require("sqlite3").verbose();
const FleetRepository = require("../../Domain/Repositories/FleetRepository");
const Fleet = require("../../Domain/Models/Fleet");

class SQLiteFleetRepository extends FleetRepository {
  constructor(dbPath = "./parking.db") {
    super();
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database " + err.message);
      } else {
        this.createTables();
      }
    });
  }

  createTables() {
    this.db.serialize(() => {
      console.log("Creating tables if they do not exist...");
      this.db.run(`
        CREATE TABLE IF NOT EXISTS fleets (
          id TEXT PRIMARY KEY,
          userId TEXT
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
  async save(fleet) {
    await new Promise((resolve, reject) => {
      const sql = `INSERT INTO fleets (id, userId) VALUES (?, ?)`;
      this.db.run(sql, [fleet.id, fleet.userId], (err) =>
        err ? reject(err) : resolve(),
      );
    });

    await new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM fleet_vehicles WHERE fleetId = ?`,
        [fleet.id],
        (err) => (err ? reject(err) : resolve()),
      );
    });

    for (const vehicleId of fleet.fleetIds) {
      await new Promise((resolve, reject) => {
        this.db.run(
          `INSERT INTO fleet_vehicles (vehicleId, fleetId) VALUES (?, ?)`,
          [vehicleId, fleet.id],
          (err) => (err ? reject(err) : resolve()),
        );
      });
    }
    return fleet;
  }

  async findById(id) {
    const fleetRow = await new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM fleets WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row),
      );
    });

    if (!fleetRow) return null;

    const vehicleIds = await new Promise((resolve, reject) => {
      this.db.all(
        `SELECT vehicleId FROM fleet_vehicles WHERE fleetId = ?`,
        [id],
        (err, rows) =>
          err ? reject(err) : resolve(rows.map((r) => r.vehicleId)),
      );
    });

    const fleet = new Fleet(fleetRow.id, fleetRow.userId);
    fleet._vehicleIds = new Set(vehicleIds);

    return fleet;
  }
}

module.exports = SQLiteFleetRepository;
