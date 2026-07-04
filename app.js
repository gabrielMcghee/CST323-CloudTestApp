const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

// Create Express application
const app = express();

// Allow form data
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("Connected to MySQL");
});

// HOME PAGE
app.get("/", (req, res) => {
    res.send(`
        <h1>Vehicle Inventory Cloud Test Application</h1>

        <a href="/vehicles">View Vehicles</a>
        <br><br>

        <a href="/add-vehicle">Add Vehicle</a>
    `);
});

// VIEW VEHICLES
app.get("/vehicles", (req, res) => {

    db.query("SELECT * FROM vehicles", (err, results) => {

        if (err) {
            return res.send(err);
        }

        let html = `
            <h1>Vehicle Inventory</h1>

            <a href="/">Home</a>
            <br><br>

            <a href="/add-vehicle">Add Vehicle</a>

            <br><br>

            <table border="1">
                <tr>
                    <th>ID</th>
                    <th>Stock #</th>
                    <th>Year</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Price</th>
                    <th>Status</th>
                </tr>
        `;

        results.forEach(vehicle => {
            html += `
                <tr>
                    <td>${vehicle.id}</td>
                    <td>${vehicle.stock_number}</td>
                    <td>${vehicle.year}</td>
                    <td>${vehicle.make}</td>
                    <td>${vehicle.model}</td>
                    <td>$${vehicle.price}</td>
                    <td>${vehicle.status}</td>
                </tr>
            `;
        });

        html += `</table>`;

        res.send(html);
    });
});

// ADD VEHICLE PAGE
app.get("/add-vehicle", (req, res) => {

    res.send(`
        <h1>Add Vehicle</h1>

        <form action="/add-vehicle" method="POST">

            <label>Stock Number</label><br>
            <input type="text" name="stock_number" required><br><br>

            <label>Year</label><br>
            <input type="number" name="year" required><br><br>

            <label>Make</label><br>
            <input type="text" name="make" required><br><br>

            <label>Model</label><br>
            <input type="text" name="model" required><br><br>

            <label>Price</label><br>
            <input type="number" step="0.01" name="price" required><br><br>

            <label>Status</label><br>
            <input type="text" name="status" required><br><br>

            <button type="submit">Add Vehicle</button>

        </form>

        <br>

        <a href="/">Home</a>
    `);
});

// INSERT VEHICLE
app.post("/add-vehicle", (req, res) => {

    const {
        stock_number,
        year,
        make,
        model,
        price,
        status
    } = req.body;

    const sql = `
        INSERT INTO vehicles
        (stock_number, year, make, model, price, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [stock_number, year, make, model, price, status],
        (err) => {

            if (err) {
                console.log(err);
                return res.send(err);
            }

            res.send(`
                <h1>Vehicle Added Successfully</h1>

                <a href="/vehicles">View Vehicles</a>
                <br><br>

                <a href="/">Home</a>
            `);
        }
    );
});

// START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});