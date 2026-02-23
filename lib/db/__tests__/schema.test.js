/**
 * @jest-environment node
 * 
 * Property-Based Tests for Database Schema Integrity
 * Feature: sila-arctic-sailing
 */

const fc = require('fast-check');
const { pool } = require('../connection');

// Check if database is available
let dbAvailable = false;

beforeAll(async () => {
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
  } catch (error) {
    console.warn('Database not available. Skipping database tests.');
    console.warn('To run these tests, ensure PostgreSQL is running and DATABASE_URL is configured.');
  }
});

// Helper to create test data
async function createTestSkipper(skipperData) {
  const result = await pool.query(
    `INSERT INTO skippers (name, certificate_name, certificate_number, phone, email)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      skipperData.name,
      skipperData.certificate_name,
      skipperData.certificate_number,
      skipperData.phone,
      skipperData.email,
    ]
  );
  return result.rows[0];
}

async function createTestYacht(yachtData) {
  const result = await pool.query(
    `INSERT INTO yachts (name, type, registration_number, home_port, length_feet, engine_power_hp)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      yachtData.name,
      yachtData.type,
      yachtData.registration_number,
      yachtData.home_port,
      yachtData.length_feet,
      yachtData.engine_power_hp,
    ]
  );
  return result.rows[0];
}

async function createTestTrip(tripData) {
  const result = await pool.query(
    `INSERT INTO trips (trip_number, city, start_date, end_date, start_port, end_port, 
                        visited_ports, skipper_id, yacht_id, max_crew_size)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      tripData.trip_number,
      tripData.city,
      tripData.start_date,
      tripData.end_date,
      tripData.start_port,
      tripData.end_port,
      tripData.visited_ports,
      tripData.skipper_id,
      tripData.yacht_id,
      tripData.max_crew_size,
    ]
  );
  return result.rows[0];
}

// Cleanup helper
async function cleanupTestData() {
  await pool.query('DELETE FROM trip_evaluations');
  await pool.query('DELETE FROM bookings');
  await pool.query('DELETE FROM trips');
  await pool.query('DELETE FROM yachts');
  await pool.query('DELETE FROM skippers');
  await pool.query('DELETE FROM user_profiles');
  await pool.query('DELETE FROM users');
}

describe('Feature: sila-arctic-sailing, Database Schema Integrity', () => {
  beforeEach(async () => {
    if (!dbAvailable) return;
    await cleanupTestData();
  });

  afterAll(async () => {
    if (!dbAvailable) return;
    await cleanupTestData();
    await pool.end();
  });

  describe('Property 3: Trip-skipper referential integrity', () => {
    it('should maintain referential integrity between trips and skippers', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            skipperName: fc.string({ minLength: 1, maxLength: 50 }),
            certificateName: fc.string({ minLength: 1, maxLength: 50 }),
            certificateNumber: fc.string({ minLength: 1, maxLength: 20 }),
            phone: fc.string({ minLength: 1, maxLength: 20 }),
            email: fc.emailAddress(),
            tripNumber: fc.string({ minLength: 1, maxLength: 20 }),
            city: fc.string({ minLength: 1, maxLength: 50 }),
            startPort: fc.string({ minLength: 1, maxLength: 50 }),
            endPort: fc.string({ minLength: 1, maxLength: 50 }),
            visitedPorts: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
          }),
          async (data) => {
            // Create a skipper
            const skipper = await createTestSkipper({
              name: data.skipperName,
              certificate_name: data.certificateName,
              certificate_number: data.certificateNumber,
              phone: data.phone,
              email: data.email,
            });

            // Create a yacht (required for trip)
            const yacht = await createTestYacht({
              name: 'Test Yacht',
              type: 'Test Type',
              registration_number: 'TEST-123',
              home_port: 'Test Port',
              length_feet: 42.0,
              engine_power_hp: 75,
            });

            // Create a trip referencing the skipper
            const startDate = new Date('2024-07-01');
            const endDate = new Date('2024-07-14');
            
            const trip = await createTestTrip({
              trip_number: data.tripNumber,
              city: data.city,
              start_date: startDate,
              end_date: endDate,
              start_port: data.startPort,
              end_port: data.endPort,
              visited_ports: data.visitedPorts,
              skipper_id: skipper.id,
              yacht_id: yacht.id,
              max_crew_size: 6,
            });

            // Verify the trip references a valid skipper
            expect(trip.skipper_id).toBe(skipper.id);

            // Verify we can retrieve the trip with its skipper
            const result = await pool.query(
              `SELECT t.*, s.name as skipper_name 
               FROM trips t 
               JOIN skippers s ON t.skipper_id = s.id 
               WHERE t.id = $1`,
              [trip.id]
            );

            expect(result.rows.length).toBe(1);
            expect(result.rows[0].skipper_name).toBe(data.skipperName);

            // Cleanup
            await pool.query('DELETE FROM trips WHERE id = $1', [trip.id]);
            await pool.query('DELETE FROM yachts WHERE id = $1', [yacht.id]);
            await pool.query('DELETE FROM skippers WHERE id = $1', [skipper.id]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject trips with invalid skipper references', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const invalidSkipperId = '00000000-0000-0000-0000-000000000000';
      
      // Create a yacht (required for trip)
      const yacht = await createTestYacht({
        name: 'Test Yacht',
        type: 'Test Type',
        registration_number: 'TEST-123',
        home_port: 'Test Port',
        length_feet: 42.0,
        engine_power_hp: 75,
      });

      // Attempt to create a trip with invalid skipper_id
      await expect(
        pool.query(
          `INSERT INTO trips (trip_number, city, start_date, end_date, start_port, end_port, 
                              visited_ports, skipper_id, yacht_id, max_crew_size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            'TEST-001',
            'Test City',
            new Date('2024-07-01'),
            new Date('2024-07-14'),
            'Port A',
            'Port B',
            ['Port A', 'Port B'],
            invalidSkipperId,
            yacht.id,
            6,
          ]
        )
      ).rejects.toThrow();

      // Cleanup
      await pool.query('DELETE FROM yachts WHERE id = $1', [yacht.id]);
    });
  });

  describe('Property 4: Trip-yacht referential integrity', () => {
    it('should maintain referential integrity between trips and yachts', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            yachtName: fc.string({ minLength: 1, maxLength: 50 }),
            yachtType: fc.string({ minLength: 1, maxLength: 50 }),
            registrationNumber: fc.string({ minLength: 1, maxLength: 20 }),
            homePort: fc.string({ minLength: 1, maxLength: 50 }),
            lengthFeet: fc.float({ min: 20, max: 100 }),
            enginePowerHp: fc.integer({ min: 10, max: 200 }),
            tripNumber: fc.string({ minLength: 1, maxLength: 20 }),
            city: fc.string({ minLength: 1, maxLength: 50 }),
            startPort: fc.string({ minLength: 1, maxLength: 50 }),
            endPort: fc.string({ minLength: 1, maxLength: 50 }),
            visitedPorts: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
          }),
          async (data) => {
            // Create a yacht
            const yacht = await createTestYacht({
              name: data.yachtName,
              type: data.yachtType,
              registration_number: data.registrationNumber,
              home_port: data.homePort,
              length_feet: data.lengthFeet,
              engine_power_hp: data.enginePowerHp,
            });

            // Create a skipper (required for trip)
            const skipper = await createTestSkipper({
              name: 'Test Skipper',
              certificate_name: 'Test Certificate',
              certificate_number: 'TEST-123',
              phone: '+48123456789',
              email: 'test@example.com',
            });

            // Create a trip referencing the yacht
            const startDate = new Date('2024-07-01');
            const endDate = new Date('2024-07-14');
            
            const trip = await createTestTrip({
              trip_number: data.tripNumber,
              city: data.city,
              start_date: startDate,
              end_date: endDate,
              start_port: data.startPort,
              end_port: data.endPort,
              visited_ports: data.visitedPorts,
              skipper_id: skipper.id,
              yacht_id: yacht.id,
              max_crew_size: 6,
            });

            // Verify the trip references a valid yacht
            expect(trip.yacht_id).toBe(yacht.id);

            // Verify we can retrieve the trip with its yacht
            const result = await pool.query(
              `SELECT t.*, y.name as yacht_name 
               FROM trips t 
               JOIN yachts y ON t.yacht_id = y.id 
               WHERE t.id = $1`,
              [trip.id]
            );

            expect(result.rows.length).toBe(1);
            expect(result.rows[0].yacht_name).toBe(data.yachtName);

            // Cleanup
            await pool.query('DELETE FROM trips WHERE id = $1', [trip.id]);
            await pool.query('DELETE FROM skippers WHERE id = $1', [skipper.id]);
            await pool.query('DELETE FROM yachts WHERE id = $1', [yacht.id]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject trips with invalid yacht references', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const invalidYachtId = '00000000-0000-0000-0000-000000000000';
      
      // Create a skipper (required for trip)
      const skipper = await createTestSkipper({
        name: 'Test Skipper',
        certificate_name: 'Test Certificate',
        certificate_number: 'TEST-123',
        phone: '+48123456789',
        email: 'test@example.com',
      });

      // Attempt to create a trip with invalid yacht_id
      await expect(
        pool.query(
          `INSERT INTO trips (trip_number, city, start_date, end_date, start_port, end_port, 
                              visited_ports, skipper_id, yacht_id, max_crew_size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            'TEST-001',
            'Test City',
            new Date('2024-07-01'),
            new Date('2024-07-14'),
            'Port A',
            'Port B',
            ['Port A', 'Port B'],
            skipper.id,
            invalidYachtId,
            6,
          ]
        )
      ).rejects.toThrow();

      // Cleanup
      await pool.query('DELETE FROM skippers WHERE id = $1', [skipper.id]);
    });
  });
});
