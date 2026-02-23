-- Sila Arctic Sailing Database Schema
-- This migration creates all core tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (managed by NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMP,
  image TEXT,
  role TEXT CHECK (role IN ('Owner', 'Skipper', 'Crew_Member')) DEFAULT 'Crew_Member',
  created_at TIMESTAMP DEFAULT NOW()
);

-- User profiles (extended information)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  birth_place TEXT,
  passport_number TEXT,
  country_of_living TEXT,
  phone TEXT,
  next_of_kin_name TEXT,
  next_of_kin_phone TEXT,
  sailing_qualification TEXT CHECK (sailing_qualification IN 
    ('YACHTMASTER', 'DAY_SKIPPER', 'COMPETENT_CREW', 'SOME_EXPERIENCE', 'NONE')),
  sailing_certificate_number TEXT,
  radio_qualification TEXT CHECK (radio_qualification IN ('VHF', 'SSB', 'NONE')),
  gun_permit_caliber TEXT,
  gun_permit_country TEXT,
  medical_qualification TEXT CHECK (medical_qualification IN 
    ('FIRST_AID', 'PARAMEDIC', 'DOCTOR', 'NONE')),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skippers
CREATE TABLE IF NOT EXISTS skippers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  certificate_name TEXT,
  certificate_number TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Yachts
CREATE TABLE IF NOT EXISTS yachts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  registration_number TEXT,
  home_port TEXT,
  length_feet DECIMAL(5,2),
  engine_power_hp INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_number TEXT NOT NULL,
  city TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_port TEXT,
  end_port TEXT,
  visited_ports TEXT[],
  miles_sailed DECIMAL(8,2),
  number_of_days INTEGER,
  engine_hours DECIMAL(6,2),
  sailing_hours DECIMAL(6,2),
  night_hours DECIMAL(6,2),
  max_sea_state TEXT,
  max_wind_conditions TEXT,
  skipper_id UUID REFERENCES skippers(id),
  yacht_id UUID REFERENCES yachts(id),
  max_crew_size INTEGER DEFAULT 6,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Reserved', 'Approved', '1st installment', 'Paid in full', 'Waitlist', 'Cancelled', 'Refunded')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, trip_id)
);

-- Trip evaluations (for Opinia z Rejsu)
CREATE TABLE IF NOT EXISTS trip_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  recommendation BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_skipper ON trips(skipper_id);
CREATE INDEX IF NOT EXISTS idx_trips_yacht ON trips(yacht_id);
CREATE INDEX IF NOT EXISTS idx_trip_evaluations_booking ON trip_evaluations(booking_id);
