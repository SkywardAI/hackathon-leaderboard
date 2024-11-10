const sqlite3 = require('sqlite3').verbose();
let db;

// Open the database connection
async function openDB(databaseFile) {
    if(db) return;
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(databaseFile, (err) => {
        if (err) {
            reject(`Failed to open database: ${err.message}`);
        } else {
            resolve(`Database opened successfully`);
        }
        });
    });
}

// Insert a new row
async function insert(data) {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const values = Object.values(data);

    const sql = `INSERT INTO results (${columns}) VALUES (${placeholders})`;

    return new Promise((resolve, reject) => {
        db.run(sql, values, function (err) {
        if (err) {
            reject(`Insert failed: ${err.message}`);
        } else {
            resolve(this.lastID);
        }
        });
    });
}

// Update an existing row by ID
async function update(data) {
    const columns = Object.keys(data).filter((key) => key !== "filename");
    const placeholders = columns.map((key) => `${key} = ?`).join(", ");
    const values = columns.map((key) => data[key]);
    values.push(data.filename);

    const sql = `UPDATE results SET ${placeholders} WHERE filename = ?`;

    return new Promise((resolve, reject) => {
        db.run(sql, values, function (err) {
        if (err) {
            reject(`Update failed: ${err.message}`);
        } else {
            resolve(this.changes);
        }
        });
    });
}

// Get all rows from a 
async function getAll() {
    const sql = `SELECT * FROM results`;
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
        if (err) {
            reject(`Get all failed: ${err.message}`);
        } else {
            resolve(rows);
        }
        });
    });
}

module.exports = { openDB, insert, update, getAll };
