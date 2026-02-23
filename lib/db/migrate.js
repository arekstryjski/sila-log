// Database migration runner
const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migration...');
    
    // Read the main schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the main schema
    await client.query(schema);
    console.log('Main schema created successfully');
    
    // Read and execute NextAuth schema
    const nextAuthSchemaPath = path.join(__dirname, 'nextauth-schema.sql');
    const nextAuthSchema = fs.readFileSync(nextAuthSchemaPath, 'utf8');
    await client.query(nextAuthSchema);
    console.log('NextAuth schema created successfully');
    
    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runMigration };
