# Database Setup

This directory contains the database schema, migration scripts, and connection utilities for the Sila Arctic Sailing application.

## Prerequisites

- PostgreSQL 15+ installed and running
- Node.js environment with required dependencies

## Setup Instructions

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sila_sailing;

# Exit psql
\q
```

### 2. Configure Environment

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/sila_sailing
```

Replace `user` and `password` with your PostgreSQL credentials.

### 3. Run Migration

```bash
npm run db:migrate
```

This will create all required tables, constraints, and indexes.

## Database Schema

The schema includes the following tables:

- `users` - User accounts (managed by NextAuth)
- `user_profiles` - Extended user information
- `skippers` - Skipper information (reusable across trips)
- `yachts` - Yacht information (reusable across trips)
- `trips` - Sailing trip records
- `bookings` - User trip bookings
- `trip_evaluations` - Post-trip evaluations (for Opinia z Rejsu)

## Running Tests

The database tests require a running PostgreSQL instance with the schema migrated.

```bash
# Ensure database is set up first
npm run db:migrate

# Run database tests
npm test lib/db/__tests__/schema.test.js
```

## Accessing the Database

### Option 1: Using psql (Command Line)

Connect to the database:
```bash
psql sila_sailing
```

Useful commands once connected:
```sql
-- List all tables
\dt

-- Describe table structure
\d users
\d user_profiles
\d skippers
\d yachts
\d trips
\d bookings
\d trip_evaluations

-- View all columns in a table
\d+ trips

-- Query data
SELECT * FROM users;
SELECT * FROM trips;
SELECT * FROM bookings;

-- Count records
SELECT COUNT(*) FROM trips;

-- Join tables
SELECT t.trip_number, t.city, s.name as skipper_name, y.name as yacht_name
FROM trips t
LEFT JOIN skippers s ON t.skipper_id = s.id
LEFT JOIN yachts y ON t.yacht_id = y.id;

-- Exit psql
\q
```

### Option 2: Using GUI Tools

**pgAdmin** (Free, Cross-platform)
- Download: https://www.pgadmin.org/
- Install and create a new server connection
- Connection details:
  - Host: `localhost`
  - Port: `5432`
  - Database: `sila_sailing`
  - Username: Your macOS username
  - Password: (leave empty)

**Postico** (macOS, Free Trial)
- Download: https://eggerapps.at/postico/
- Click "New Favorite"
- Enter connection details (same as above)
- Browse tables visually with a clean interface

**TablePlus** (macOS, Free Trial)
- Download: https://tableplus.com/
- Create new connection → PostgreSQL
- Enter connection details (same as above)
- Provides a modern UI for browsing and editing data

### Option 3: Using VS Code Extension

Install the **PostgreSQL** extension by Chris Kolkman:
1. Open VS Code Extensions (Cmd+Shift+X)
2. Search for "PostgreSQL"
3. Install the extension
4. Add connection in the PostgreSQL explorer panel
5. Browse tables and run queries directly in VS Code

## Files

- `schema.sql` - Complete database schema with tables, constraints, and indexes
- `connection.js` - PostgreSQL connection pool utility
- `migrate.js` - Migration runner script
- `__tests__/schema.test.js` - Property-based tests for schema integrity
