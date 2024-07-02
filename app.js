const express = require('express');
const sql = require('mssql');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Azure SQL Database configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., 'your-server.database.windows.net'
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

// Test database connection
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to Azure SQL Database');
    }
}).catch(err => console.log('Database connection failed: ', err));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints
app.get('/projects', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Projects');
        res.send(result.recordset);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/projects', async (req, res) => {
    const { project, priority } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('project', sql.VarChar, project)
            .input('priority', sql.Int, priority)
            .query('INSERT INTO Projects (Project, Priority) VALUES (@project, @priority)');
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to check Node.js version
app.get('/version', (req, res) => {
    res.send(`Node.js version: ${process.version}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
