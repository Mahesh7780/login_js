# User Registration App with ExcelJS

This is a Node.js application using Express that allows users to register via a POST endpoint. Registration data is stored in an Excel file (`registrations.xlsx`) using the `exceljs` package.

## Features
- **POST /register** endpoint to accept user registration data: `name`, `email`, `password`, `phone`.
- Stores registration data in `registrations.xlsx` with columns: Name, Email, Password (encrypted), Phone, RegisteredAt.
- Prevents duplicate registrations by checking if the email already exists.
- Returns JSON responses for success and error cases.
- Uses `body-parser` middleware to parse incoming JSON.
- Passwords are encrypted using `bcryptjs` before being saved.
- Code is organized and commented for clarity.

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install express exceljs body-parser
   npm install bcryptjs
   ```
   Or, if you prefer, use:
   ```bash
   npm install
   ```
   (if you have the included `package.json`)

2. **Run the server:**

   ```bash
   node app.js
   ```
   Or, if using npm scripts:
   ```bash
   npm start
   ```

3. **Register a user:**
   - Send a POST request to `http://localhost:3000/register` with a JSON body:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "yourpassword",
       "phone": "1234567890"
     }
     ```
   - You can use tools like [Postman](https://www.postman.com/) or `curl`:
     ```bash
     curl -X POST http://localhost:3000/register \
       -H "Content-Type: application/json" \
       -d '{"name":"John Doe","email":"john@example.com","password":"yourpassword","phone":"1234567890"}'
     ```

## Notes
- The Excel file will be created automatically if it does not exist.
- Duplicate emails are not allowed; the API will return `{ success: false, message: "Email already registered" }` if attempted.
- All fields are required.

## License
MIT 