# Brokerless Realty Backend

This is the Node.js backend for the Brokerless Realty application, structured using the MVC (Model-View-Controller) pattern. It uses Knex.js for database migrations.

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- A running MySQL server

### 2. Installation
- Clone the repository.
- Navigate to the `backend` directory: `cd backend`
- Install dependencies: `npm install`

### 3. Environment Configuration
1.  Create a `.env` file in the `backend` directory by copying `.env.example`.
2.  Update the `.env` file with your MySQL database credentials (you'll need to create an empty database first, e.g., `brokerless_db`).

### 4. Database Setup
The database schema is managed by Knex migrations, and initial data is handled by a seeder.

1.  **Run Migrations:** This command will create all necessary tables in your database.
    ```bash
    npm run migrate:latest
    ```
2.  **Run Seeder:** This command will seed the database with an initial admin user.
    ```bash
    npm run seed
    ```
- **Your default admin credentials will be printed in the console.**

### 5. Running the Server
- Start the server: `npm start`
- The API will be running on `http://localhost:3001` by default.

### Creating New Migrations
To make changes to the database schema in the future, create a new migration file:
```bash
npm run migrate:make add_new_feature_to_table
```
This will create a new file in the `backend/migrations` directory. Edit this file to define your schema changes, then run `npm run migrate:latest` to apply them.
