// app.js
// Main Express application for user registration with ExcelJS

const express = require('express');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Path to the Excel file
const excelFilePath = path.join(__dirname, 'registrations.xlsx');

// Helper function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// POST /register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Basic validation
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  try {
    // Load or create the Excel file and worksheet
    if (fileExists(excelFilePath)) {
      await workbook.xlsx.readFile(excelFilePath);
      worksheet = workbook.getWorksheet('Registrations');
      if (!worksheet) {
        worksheet = workbook.addWorksheet('Registrations');
        worksheet.addRow(['Name', 'Email', 'Password', 'Phone', 'RegisteredAt']);
      }
    } else {
      worksheet = workbook.addWorksheet('Registrations');
      worksheet.addRow(['Name', 'Email', 'Password', 'Phone', 'RegisteredAt']);
    }

    // Check if email already exists (case-insensitive)
    const emailExists = worksheet.getColumn(2).values.some((cell, idx) => {
      if (idx === 1) return false; // Skip header
      return cell && cell.toString().toLowerCase() === email.toLowerCase();
    });
    if (emailExists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Encrypt the password before saving
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Append new row with encrypted password
    worksheet.addRow([
      name,
      email,
      hashedPassword,
      phone,
      new Date().toISOString(),
    ]);

    await workbook.xlsx.writeFile(excelFilePath);

    return res.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 