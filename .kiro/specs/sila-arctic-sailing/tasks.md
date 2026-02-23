# Implementation Plan: Sila Arctic Sailing Website

## Overview

This implementation plan breaks down the Sila Arctic Sailing platform into discrete coding tasks. The system will be built using React, Next.js, PostgreSQL, and various integrations (NextAuth.js, Tina CMS, React-PDF, Leaflet.js). Tasks are ordered to build foundational components first, then layer on features incrementally.

## Tasks

- [x] 1. Initialize Next.js project and configure core dependencies
  - Create Next.js 14+ project with App Router
  - Install dependencies: react, next, pg, next-auth, @react-pdf/renderer, react-leaflet, leaflet, fast-check, jest
  - Configure Tailwind CSS for styling
  - Set up project structure: /app, /components, /lib, /content, /locales
  - _Requirements: 17.1, 17.2_

- [ ] 2. Set up PostgreSQL database schema
  - [ ] 2.1 Create database migration for core tables
    - Create users, user_profiles, skippers, yachts, trips, bookings, trip_evaluations tables
    - Add CHECK constraints for enum fields
    - Add foreign key relationships with CASCADE deletes
    - Create indexes on foreign keys and frequently queried fields
    - _Requirements: 2.1, 3.1, 3.3, 10.1, 11.10, 12.1, 18.2_
  
  - [ ] 2.2 Write property test for database schema integrity
    - **Property 3: Trip-skipper referential integrity**
    - **Property 4: Trip-yacht referential integrity**
    - **Validates: Requirements 2.5, 2.6**

- [ ] 3. Implement NextAuth.js authentication
  - [ ] 3.1 Configure NextAuth with PostgreSQL adapter
    - Set up NextAuth configuration with social providers (Google, Facebook, GitHub)
    - Configure PostgreSQL adapter for session storage
    - Add role field to user model with default 'Crew_Member'
    - Implement callbacks for role assignment
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 3.2 Create authorization middleware
    - Write middleware to check user roles
    - Implement route protection for Skipper/Owner endpoints
    - Add helper functions: requireAuth, requireRole
    - _Requirements: 10.6, 10.7_
  
  - [ ] 3.3 Write property tests for authentication
    - **Property 33: User role validation**
    - **Property 34: Owner role limit**
    - **Property 35: Skipper permissions**
    - **Property 36: Crew member permissions**
    - **Validates: Requirements 10.4, 10.5, 10.6, 10.7**

- [ ] 4. Create user profile management system
  - [ ] 4.1 Implement profile data model and validation
    - Create user_profiles table operations (CRUD)
    - Implement validation for required fields
    - Add conditional validation for certificate numbers
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ] 4.2 Build profile API endpoints
    - GET /api/profile - Get current user profile
    - PUT /api/profile - Update profile with validation
    - DELETE /api/profile - GDPR-compliant deletion
    - GET /api/profile/export - Export user data as JSON
    - _Requirements: 11.8, 12.2_
  
  - [ ] 4.3 Write property tests for profile validation
    - **Property 37: Profile data completeness for booking**
    - **Property 38: Emergency contact information**
    - **Property 39: Sailing qualification enum validation**
    - **Property 40: Certificate number requirement**
    - **Property 41: Radio qualification enum validation**
    - **Property 42: Gun permit conditional fields**
    - **Property 43: Medical qualification enum validation**
    - **Validates: Requirements 11.1-11.7**
  
  - [ ] 4.4 Write property test for GDPR deletion
    - **Property 45: GDPR data deletion**
    - **Validates: Requirements 12.2**

- [ ] 5. Implement skipper and yacht management
  - [ ] 5.1 Create skipper and yacht CRUD operations
    - Implement database operations for skippers table
    - Implement database operations for yachts table
    - Add validation for required fields
    - _Requirements: 3.2, 3.4_
  
  - [ ] 5.2 Build admin API endpoints
    - POST /api/skippers - Create skipper (Owner only)
    - GET /api/skippers - List all skippers
    - PUT /api/skippers/[id] - Update skipper (Owner only)
    - POST /api/yachts - Create yacht (Owner only)
    - GET /api/yachts - List all yachts
    - PUT /api/yachts/[id] - Update yacht (Owner only)
    - _Requirements: 3.2, 3.4_
  
  - [ ] 5.3 Write property tests for skipper and yacht data
    - **Property 5: Skipper data completeness**
    - **Property 6: Yacht data completeness**
    - **Property 7: Skipper and yacht reusability**
    - **Validates: Requirements 3.2, 3.4, 3.7**

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement trip management system
  - [ ] 7.1 Create trip CRUD operations
    - Implement database operations for trips table
    - Add validation for required fields and date logic
    - Implement capacity calculation logic
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 7.2 Build trip API endpoints
    - POST /api/trips - Create trip (Skipper/Owner only)
    - GET /api/trips - List all trips with filters (public)
    - GET /api/trips/[id] - Get trip details (public)
    - PUT /api/trips/[id] - Update trip (Skipper/Owner only)
    - DELETE /api/trips/[id] - Delete trip (Owner only)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 7.3 Write property tests for trip management
    - **Property 2: Trip data completeness**
    - **Property 18: Trip list shows only fixed-date trips**
    - **Property 19: Full trips are marked correctly**
    - **Validates: Requirements 2.2, 2.3, 2.4, 7.3, 7.4**

- [ ] 8. Implement booking system
  - [ ] 8.1 Create booking logic with capacity management
    - Implement booking creation with capacity check
    - Add logic for Reserved vs Waitlist status
    - Implement status transition validation
    - Add cancellation logic with waitlist promotion
    - _Requirements: 8.1, 8.2, 8.3, 8.6, 8.7_
  
  - [ ] 8.2 Build booking API endpoints
    - POST /api/bookings - Create booking (authenticated users)
    - GET /api/bookings/my - Get user's bookings (authenticated)
    - GET /api/bookings/trip/[tripId] - Get trip bookings (Skipper/Owner)
    - PUT /api/bookings/[id] - Update booking status (Skipper/Owner)
    - DELETE /api/bookings/[id] - Cancel booking (user or Skipper/Owner)
    - PUT /api/bookings/[id]/refund - Mark as refunded (Skipper/Owner only)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 8.3 Write property tests for booking system
    - **Property 24: Booking status based on capacity**
    - **Property 25: Valid booking status transitions**
    - **Property 28: Maximum crew size enforcement**
    - **Property 29: Booking requires approval**
    - **Property 29a: Cancelled bookings don't count toward capacity**
    - **Property 29b: Refund requires skipper authorization**
    - **Property 29c: Waitlist promotion on cancellation**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.6, 8.7**
  
  - [ ] 8.4 Write property tests for booking view permissions
    - **Property 26: Crew member booking view restrictions**
    - **Property 27: Skipper booking view permissions**
    - **Validates: Requirements 8.4, 8.5**

- [ ] 9. Integrate WhatsApp notifications
  - [ ] 9.1 Set up WhatsApp Business API client
    - Configure WhatsApp Business API credentials
    - Create notification service module
    - Implement message formatting function
    - Add error handling with graceful degradation
    - _Requirements: 9.1, 9.2_
  
  - [ ] 9.2 Add notification triggers to booking operations
    - Trigger notification on booking creation
    - Trigger notification on booking status change
    - Ensure booking operations succeed even if notification fails
    - _Requirements: 9.1, 9.3_
  
  - [ ] 9.3 Write property tests for notifications
    - **Property 30: Booking creation triggers notification**
    - **Property 31: Notification message completeness**
    - **Property 32: Status changes trigger notifications**
    - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Set up Tina CMS for content management
  - [ ] 11.1 Configure Tina CMS
    - Install Tina CMS dependencies
    - Create tina/config.js with collections for blog, pages, destinations
    - Define content schemas with frontmatter fields
    - Set up /admin route for CMS access
    - Configure Git commit integration
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 6.1_
  
  - [ ] 11.2 Create content directory structure
    - Create /content/blog, /content/pages, /content/destinations directories
    - Add example content files for each type
    - _Requirements: 1.1, 5.1, 6.1_
  
  - [ ] 11.3 Write property test for CMS Git integration
    - **Property 1: Content changes create Git commits**
    - **Validates: Requirements 1.3**

- [ ] 12. Implement blog post rendering
  - [ ] 12.1 Create blog post parser and renderer
    - Parse Markdown files with frontmatter
    - Convert Markdown to HTML
    - Implement blog list page with filtering by tags
    - Implement blog detail page
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [ ] 12.2 Add trip data integration to blog posts
    - Query trip data when tripId is present in frontmatter
    - Display trip statistics on blog post page
    - _Requirements: 4.6_
  
  - [ ] 12.3 Write property tests for blog functionality
    - **Property 8: Blog post Markdown format**
    - **Property 9: Blog post categorization by tags**
    - **Property 11: Trip-linked blog posts display statistics**
    - **Validates: Requirements 4.1, 4.4, 4.6**

- [ ] 13. Implement map generation for blog posts
  - [ ] 13.1 Create Leaflet map component
    - Install react-leaflet and leaflet dependencies
    - Create reusable TripMap component
    - Implement port geocoding (hardcoded coordinates for Arctic ports)
    - Render markers and polylines for trip routes
    - _Requirements: 4.5, 16.1, 16.4_
  
  - [ ] 13.2 Write property test for map generation
    - **Property 10: Trip-linked blog posts generate maps**
    - **Property 54: Trip-linked blog posts render maps**
    - **Validates: Requirements 4.5, 16.1**

- [ ] 14. Implement destination pages
  - [ ] 14.1 Create destination parser and renderer
    - Parse destination Markdown files
    - Implement destination list page
    - Implement destination detail page with galleries
    - Query related trips for each destination
    - _Requirements: 6.2, 6.3, 6.9, 6.10_
  
  - [ ] 14.2 Write property tests for destinations
    - **Property 12: Destination data completeness**
    - **Property 13: Destination gallery display**
    - **Property 16: Destination shows related trips**
    - **Validates: Requirements 6.2, 6.3, 6.10**

- [ ] 15. Implement image optimization
  - [ ] 15.1 Set up image optimization pipeline
    - Configure Cloudinary integration (or sharp for self-hosted)
    - Create image upload handler
    - Implement WebP conversion and resizing
    - Add responsive image component
    - _Requirements: 6.8, 17.1, 17.2_
  
  - [ ] 15.2 Add image tagging system
    - Implement manual tag storage in frontmatter
    - Add EXIF data extraction (optional)
    - Implement tag precedence logic (manual over EXIF)
    - _Requirements: 6.5, 6.7_
  
  - [ ] 15.3 Write property tests for image handling
    - **Property 14: Manual tags take precedence**
    - **Property 15: Image optimization**
    - **Validates: Requirements 6.7, 6.8**

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Build trip display pages
  - [ ] 17.1 Create trip list page
    - Implement trip list component with filtering (past/future)
    - Display required fields: date, title, ports, days, skipper, availability
    - Add "Full" badge for trips at capacity
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 17.2 Create trip detail page
    - Display all trip information
    - Render itinerary with port descriptions
    - Link ports to destination pages
    - Show booking button (if authenticated and spots available)
    - _Requirements: 7.5, 7.6, 7.7, 7.8, 7.9_
  
  - [ ] 17.3 Write property tests for trip display
    - **Property 17: Trip list displays required fields**
    - **Property 20: Trip detail page completeness**
    - **Property 21: Itinerary displays all ports**
    - **Property 22: Multiple itinerary variants displayed**
    - **Property 23: Itinerary ports link to destinations**
    - **Validates: Requirements 7.2, 7.6, 7.7, 7.8, 7.9**

- [ ] 18. Implement bilingual support system
  - [ ] 18.1 Create translation infrastructure
    - Create locales/pl.json and locales/en.json files
    - Add enum translations for qualifications, radio, medical
    - Implement translation helper function
    - Create language switcher component
    - _Requirements: 13.1, 13.2_
  
  - [ ] 18.2 Add language filtering for content
    - Filter blog posts by language
    - Filter destinations by language
    - Hide untranslated content in English mode
    - _Requirements: 13.3, 13.4, 13.5_
  
  - [ ] 18.3 Write property test for language filtering
    - **Property 46: Language filtering for English mode**
    - **Validates: Requirements 13.3, 13.4**

- [ ] 19. Build PDF document generation system
  - [ ] 19.1 Create Crew List PDF template
    - Design React-PDF component for crew list
    - Include trip header, crew table, signature footer
    - Implement data fetching for approved bookings
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ] 19.2 Create Opinia z Rejsu PDF template
    - Design React-PDF component for Opinia
    - Include crew info, trip stats, evaluation fields
    - Implement data fetching for booking and evaluation
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 19.3 Build PDF generation API endpoints
    - GET /api/documents/crew-list/[tripId] - Generate crew list
    - GET /api/documents/opinia/[bookingId] - Generate Opinia
    - Add access control checks
    - Stream PDF to client without storing
    - _Requirements: 14.4, 14.5, 15.6, 15.7_
  
  - [ ] 19.4 Write property tests for document generation
    - **Property 47: Crew list generation**
    - **Property 48: Crew list includes approved bookings**
    - **Property 49: Crew list field completeness**
    - **Property 50: Crew list access control**
    - **Property 51: Opinia generation**
    - **Property 52: Opinia document completeness**
    - **Property 53: Opinia access control**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**

- [ ] 20. Create user-facing UI components
  - [ ] 20.1 Build profile management UI
    - Create profile form with all fields
    - Add conditional field display (certificate numbers, gun permit)
    - Implement form validation
    - Display booking history
    - _Requirements: 11.1-11.8_
  
  - [ ] 20.2 Build booking management UI
    - Create booking button on trip detail page
    - Build "My Bookings" page for crew members
    - Build booking management dashboard for Skipper/Owner
    - Add status update controls for Skipper/Owner
    - Add cancellation and refund controls
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 20.3 Build admin UI for trip management
    - Create trip creation form
    - Create trip editing interface
    - Add skipper and yacht selection dropdowns
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 21. Implement responsive design
  - [ ] 21.1 Create responsive layout components
    - Build responsive navigation (hamburger menu on mobile)
    - Create responsive grid layouts for trip cards
    - Implement mobile-optimized forms
    - Add responsive image components
    - _Requirements: 20.1, 20.3, 20.4, 20.5_
  
  - [ ] 21.2 Configure Tailwind breakpoints and utilities
    - Set up mobile, tablet, desktop breakpoints
    - Create responsive utility classes
    - Test layouts at different screen sizes
    - _Requirements: 20.1, 20.3_

- [ ] 22. Add social sharing and galleries
  - [ ] 22.1 Implement social sharing for blog posts
    - Add Open Graph meta tags
    - Create share buttons for common platforms
    - _Requirements: 4.7_
  
  - [ ] 22.2 Build image gallery components
    - Create gallery component for blog posts
    - Create gallery component for destinations
    - Implement lightbox for full-size viewing
    - _Requirements: 4.3, 6.3, 6.4_

- [ ] 23. Implement static pages
  - [ ] 23.1 Create static page renderer
    - Parse static page Markdown files
    - Create page routes for yacht info, skippers, sailing areas, packing guides
    - _Requirements: 5.2, 5.3_

- [ ] 24. Final integration and testing
  - [ ] 24.1 Wire all components together
    - Connect authentication to all protected routes
    - Integrate booking system with trip display
    - Connect blog posts to trip data and maps
    - Link destinations to trips and galleries
    - _Requirements: All_
  
  - [ ] 24.2 Write integration tests
    - Test complete booking flow
    - Test document generation flow
    - Test content rendering with trip data
    - _Requirements: All_

- [ ] 25. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Property tests should run with minimum 100 iterations
- All property tests must be tagged with: **Feature: sila-arctic-sailing, Property {N}: {property text}**
- Checkpoints ensure incremental validation
- Database migrations should be reversible
- All API endpoints require proper error handling
- All tests are required for comprehensive coverage from the start
