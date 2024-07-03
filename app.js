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
        res.json(result.recordset); // Ensure it returns JSON
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/projects', async (req, res) => {
    const { projects } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request().query('DELETE FROM Projects'); // Clear existing data
        for (const project of projects) {
            await pool.request()
                .input('project', sql.VarChar, project.Project)
                .input('priority', sql.Int, project.Priority)
                .query('INSERT INTO Projects (Project, Priority) VALUES (@project, @priority)');
        }
        res.send({ message: 'Projects updated successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/criteria', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Criteria');
        res.json(result.recordset); // Ensure it returns JSON
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/criteria', async (req, res) => {
    const { criteria } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request().query('DELETE FROM Criteria'); // Clear existing data
        for (const criterion of criteria) {
            await pool.request()
                .input('name', sql.VarChar, criterion.Name)
                .input('weight', sql.Int, criterion.Weight)
                .query('INSERT INTO Criteria (Name, Weight) VALUES (@name, @weight)');
        }
        res.send({ message: 'Criteria updated successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/respondents', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Respondents');
        res.json(result.recordset); // Ensure it returns JSON
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/respondents', async (req, res) => {
    const { respondents } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request().query('DELETE FROM Respondents'); // Clear existing data
        for (const respondent of respondents) {
            await pool.request()
                .input('name', sql.VarChar, respondent.Name)
                .query('INSERT INTO Respondents (Name) VALUES (@name)');
        }
        res.send({ message: 'Respondents updated successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/rankings', async (req, res) => {
    const { projectId, respondentId, criteriaId, rank } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('projectId', sql.Int, projectId)
            .input('respondentId', sql.Int, respondentId)
            .input('criteriaId', sql.Int, criteriaId)
            .input('rank', sql.Int, rank)
            .query('INSERT INTO ProjectRankings (ProjectID, RespondentID, CriteriaID, Rank) VALUES (@projectId, @respondentId, @criteriaId, @rank)');
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
