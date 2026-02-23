# Sila Arctic Sailing

A bilingual platform for Arctic sailing trips aboard the yacht Sila.

## Tech Stack

- Next.js 14+ (App Router)
- React 18+
- PostgreSQL
- NextAuth.js v5
- Tina CMS
- React-PDF
- Leaflet.js
- Tailwind CSS

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Set up PostgreSQL database:

#### Install PostgreSQL (macOS with Homebrew):
```bash
brew install postgresql@15
```

#### Start PostgreSQL service:
```bash
brew services start postgresql@15
```

#### Add PostgreSQL to your PATH (add to ~/.zshrc for persistence):
```bash
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

#### Create the database:
```bash
createdb sila_sailing
```

### 3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the DATABASE_URL:
```
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/sila_sailing
```

Replace `YOUR_USERNAME` with your macOS username (run `whoami` to find it).

### 4. Run database migration:
```bash
npm run db:migrate
```

This creates all required tables, constraints, and indexes.

### 5. Run the development server:
```bash
npm run dev
```

### 6. Open [http://localhost:3000](http://localhost:3000)

## Database Access

### Recommended: Using Postico (PostgreSQL GUI - like MySQL Workbench)

Postico is the best PostgreSQL GUI for macOS, similar to MySQL Workbench.

**Installation:**
```bash
brew install --cask postico
```

**Setup:**
1. Open Postico from Applications
2. Click "New Favorite" (or it may auto-detect your local database)
3. Enter connection details:
   - **Nickname**: Sila Sailing (optional)
   - **Host**: `localhost`
   - **Port**: `5432`
   - **User**: Your macOS username (run `whoami` to find it)
   - **Database**: `sila_sailing`
   - **Password**: (leave empty)
4. Click "Connect"

**Using Postico:**
- Browse tables in the left sidebar
- Click any table to view its data
- Use the "Structure" tab to see columns, types, and constraints
- Use the "Content" tab to view and edit data
- Use the "Query" tab to run custom SQL queries
- Visual relationship diagrams show foreign key connections

### Alternative: Using psql (Command Line)

Connect to the database:
```bash
psql sila_sailing
```

Useful psql commands:
```sql
-- List all tables
\dt

-- Describe a specific table
\d users
\d trips
\d bookings

-- View table data
SELECT * FROM users;
SELECT * FROM trips;
SELECT * FROM bookings;

-- Exit psql
\q
```

### Other GUI Options:

- **TablePlus** (macOS, free trial): https://tableplus.com/ - Modern, fast interface
- **pgAdmin** (free, cross-platform): https://www.pgadmin.org/ - Full-featured but heavier
- **DBeaver** (free, cross-platform): https://dbeaver.io/ - Universal database tool

### Database Schema

The database includes these tables:
- `users` - User accounts (managed by NextAuth)
- `user_profiles` - Extended user information and qualifications
- `skippers` - Skipper information (reusable across trips)
- `yachts` - Yacht information (reusable across trips)
- `trips` - Sailing trip records with dates, ports, and statistics
- `bookings` - User trip bookings with status tracking
- `trip_evaluations` - Post-trip evaluations (for Opinia z Rejsu documents)

See `lib/db/schema.sql` for the complete schema definition.

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and database clients
- `/content` - Markdown content (blog, pages, destinations)
- `/locales` - Translation files (pl.json, en.json)

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run database tests (requires PostgreSQL running):
```bash
npm test lib/db/__tests__/schema.test.js
```

## Database Management

### Reset database (drop and recreate):
```bash
dropdb sila_sailing
createdb sila_sailing
npm run db:migrate
```

### Backup database:
```bash
pg_dump sila_sailing > backup.sql
```

### Restore database:
```bash
psql sila_sailing < backup.sql
```

## License

Private
