# Requirements Document: Sila Arctic Sailing Website

## Introduction

The Sila Arctic Sailing website is a bilingual platform for the yacht "Sila" that offers Arctic sailing trips. The system provides content management, trip booking, user management, and blog functionality with a focus on minimal costs, GDPR compliance, and ease of content updates without developer intervention.

## Glossary

- **System**: The Sila Arctic Sailing website platform
- **CMS**: Content Management System (Git-based, using Markdown files)
- **Crew_Member**: A registered user who can view and book trips
- **Skipper**: An admin user who can create and manage trips and approve bookings
- **Owner**: The highest privilege user with full system access
- **Trip**: A predefined sailing expedition with fixed dates and crew capacity
- **Booking**: A crew member's reservation for a specific trip
- **Content_Item**: Any Markdown-based content (blog post, static page, gallery)
- **GDPR**: General Data Protection Regulation compliance requirements
- **Yacht**: The sailing vessel with associated technical specifications
- **Trip_Statistics**: Quantitative data about a completed trip (miles, hours, conditions)
- **Crew_List**: A document listing all crew members for a specific trip
- **Opinia_z_Rejsu**: A post-trip evaluation document for individual crew members
- **Next_of_Kin**: Emergency contact information for crew members

## Requirements

### Requirement 1: Git-Based Content Management

**User Story:** As a content editor, I want to manage website content through a Git-based CMS using Markdown files, so that I can update content without code changes or developer assistance.

#### Acceptance Criteria

1. THE System SHALL store all content as Markdown files in the Git repository
2. WHEN a content editor accesses the CMS interface, THE System SHALL provide online editing capabilities
3. WHEN a content editor creates or modifies content, THE System SHALL commit changes to the Git repository
4. THE System SHALL support Decap CMS or Tina CMS as the content management interface
5. WHEN new content types are needed, THE System SHALL allow their addition without code modifications

### Requirement 2: Trip Data Management

**User Story:** As a skipper, I want to record comprehensive trip information including dates, ports, statistics, and crew, so that I can maintain accurate records and generate trip reports.

#### Acceptance Criteria

1. THE System SHALL store trip data in the PostgreSQL database
2. WHEN a trip is created, THE System SHALL record trip number, city, start date, end date, start port, end port, and visited ports/anchorages
3. THE System SHALL store trip statistics including miles sailed, number of days, engine hours, sailing hours, and night hours
4. THE System SHALL record maximum sea state and maximum wind conditions for each trip
5. THE System SHALL associate each trip with a skipper record
6. THE System SHALL associate each trip with a yacht record
7. THE System SHALL maintain separate tables for skipper information and yacht information

### Requirement 3: Skipper and Yacht Information

**User Story:** As a system administrator, I want to maintain skipper and yacht information separately, so that I can reuse this data across multiple trips.

#### Acceptance Criteria

1. THE System SHALL store skipper information in a dedicated database table
2. THE System SHALL store skipper name, certificate name, certificate number, phone, and email
3. THE System SHALL store yacht information in a dedicated database table
4. THE System SHALL store yacht name, type, registration number, home port, length, and engine power
5. WHEN a trip references a skipper, THE System SHALL link to the skipper record
6. WHEN a trip references a yacht, THE System SHALL link to the yacht record
7. THE System SHALL allow multiple trips to reference the same skipper or yacht

### Requirement 4: Blog and Relations Content

**User Story:** As a content editor, I want to create blog posts linked to trip data with images, tags, and auto-generated maps and statistics, so that I can share comprehensive stories about Arctic sailing trips.

#### Acceptance Criteria

1. WHEN a blog post is created, THE System SHALL store it as a Markdown file with frontmatter metadata
2. THE System SHALL support inline images within blog posts
3. THE System SHALL optionally support an image gallery at the end of blog posts
4. WHEN a blog post is tagged, THE System SHALL categorize it by areas (Svalbard, Greenland, renovation, etc.)
5. WHEN a blog post is linked to trip data, THE System SHALL generate a simplified map following coastlines based on port information
6. WHEN a blog post is linked to trip data, THE System SHALL display trip statistics automatically
7. THE System SHALL provide social sharing functionality for blog posts
8. THE System SHALL support a comments system with implementation to be determined

### Requirement 3: Static Pages Management

**User Story:** As a content editor, I want to create and manage static informational pages, so that I can provide essential information about the yacht, skippers, and sailing areas.

#### Acceptance Criteria

1. THE System SHALL store static pages as Markdown files in the Git repository
2. THE System SHALL support pages for yacht information, project history, name explanation, skippers, sailing areas, and packing guides
3. WHEN a static page is created or modified, THE System SHALL make it immediately available on the website

### Requirement 4: Destination Database and Image Galleries

**User Story:** As a content editor, I want to create destination pages with descriptions and galleries, so that I can showcase Arctic locations and provide detailed information about ports and anchorages.

#### Acceptance Criteria

1. THE System SHALL store destination pages as Markdown files in the Git repository
2. WHEN a destination is created, THE System SHALL include a short description and a long description
3. THE System SHALL display a mini gallery on each destination page
4. THE System SHALL support global galleries organized by location
5. THE System SHALL allow manual tagging of images with destination names
6. WHERE EXIF data reading is cost-effective, THE System SHALL extract metadata from images
7. WHEN manual tags are provided, THE System SHALL prioritize them over EXIF data
8. THE System SHALL optimize images for web display
9. THE System SHALL provide a browsable list of all destinations
10. WHEN viewing a destination, THE System SHALL display planned trips that will visit that location

### Requirement 5: Trip List and Display

**User Story:** As a crew member, I want to view a list of past and future trips with detailed information, so that I can see available sailing opportunities and plan my participation.

#### Acceptance Criteria

1. THE System SHALL display a list showing all past and future trips
2. WHEN displaying the trip list, THE System SHALL show date, title, start port, end port, number of days (calculated), skipper, and availability status
3. THE System SHALL only display predefined trips with fixed dates
4. WHEN a trip reaches maximum crew capacity, THE System SHALL mark it as full
5. WHEN a user clicks on a trip, THE System SHALL display a detailed trip page
6. THE Trip detail page SHALL display all trip list information plus full itinerary
7. THE Trip itinerary SHALL list planned ports and anchorages with short descriptions
8. WHEN a trip has multiple itinerary variants, THE System SHALL display all variants on the trip detail page
9. WHEN a port or anchorage is listed in an itinerary, THE System SHALL link to the destination detail page

### Requirement 6: Trip Booking Workflow

**User Story:** As a crew member, I want to book trips and track my booking status, so that I can secure my place on Arctic sailing expeditions.

#### Acceptance Criteria

1. WHEN a crew member selects a trip, THE System SHALL create a booking with "Reserved" status
2. WHEN a trip is full, THE System SHALL add new booking requests to a waitlist
3. WHEN a skipper reviews a booking, THE System SHALL allow status changes to "Approved", "1st installment", or "Paid in full"
4. WHEN a crew member views their bookings, THE System SHALL display only interest level information
5. WHEN a skipper or owner views bookings, THE System SHALL display full booking details and payment status
6. THE System SHALL enforce maximum crew size per trip
7. THE System SHALL require skipper approval for all bookings

### Requirement 8: Booking Notifications

**User Story:** As a skipper, I want to receive WhatsApp notifications when new bookings are created, so that I can respond quickly to crew member interest.

#### Acceptance Criteria

1. WHEN a new booking is created, THE System SHALL send a notification to a dedicated WhatsApp group
2. THE Notification SHALL include crew member name, trip details, and booking timestamp
3. THE System SHALL send notifications for all booking status changes

### Requirement 9: User Authentication and Authorization

**User Story:** As a user, I want to authenticate using social login providers, so that I can access the system without creating passwords.

#### Acceptance Criteria

1. THE System SHALL implement authentication using NextAuth.js
2. THE System SHALL support multiple social login providers
3. THE System SHALL NOT require users to create passwords
4. WHEN a user authenticates, THE System SHALL assign one of three roles: Owner, Skipper, or Crew_Member
5. THE System SHALL limit Owner role to exactly two accounts
6. WHEN a Skipper authenticates, THE System SHALL grant trip creation and management permissions
7. WHEN a Crew_Member authenticates, THE System SHALL grant trip viewing and booking permissions

### Requirement 10: Crew Member Profiles and Personal Information

**User Story:** As a crew member, I want to provide comprehensive personal information and qualifications during booking, so that skippers have all necessary details for trip planning and legal requirements.

#### Acceptance Criteria

1. WHEN a crew member books a trip, THE System SHALL collect name, date of birth, birth place, passport number, country of living, phone, and email
2. THE System SHALL collect next of kin name and phone number
3. THE System SHALL collect sailing qualification as one of: Yachtmaster/Kapitan, Day Skipper/Sternik, Competent Crew/Żeglarz, Some Experience, or None
4. WHEN sailing qualification is Yachtmaster, Day Skipper, or Competent Crew, THE System SHALL request certificate number
5. THE System SHALL collect radio qualification as one of: VHF, SSB, or None
6. THE System SHALL collect gun permit information including caliber and country of certificate if applicable
7. THE System SHALL collect medical qualification as one of: First-aid, Paramedic, Doctor, or None
8. WHEN a crew member views their profile, THE System SHALL display current and past booking history
9. THE System SHALL allow import of historic crew data
10. THE System SHALL store all personal data in compliance with GDPR requirements

### Requirement 11: GDPR Compliance and Data Management

**User Story:** As a system administrator, I want to ensure GDPR compliance for all user data, so that the system meets legal requirements for European users.

#### Acceptance Criteria

1. THE System SHALL store all user data, bookings, and qualifications in PostgreSQL database
2. WHEN a user requests data deletion, THE System SHALL remove all personal information (right to be forgotten)
3. THE System SHALL maintain clear relational structure between users, bookings, and trips
4. THE System SHALL store data in a way that facilitates easy deletion and export
5. THE System SHALL process data only for users from Europe

### Requirement 12: Bilingual Content Support

**User Story:** As a content editor, I want to provide content in Polish and English, so that I can serve both primary Polish users and potential English-speaking collaborators.

#### Acceptance Criteria

1. THE System SHALL use Polish as the default language
2. THE System SHALL provide manual language switching to English
3. WHEN English translation exists for content, THE System SHALL display it in English mode
4. WHEN English translation does not exist for content, THE System SHALL hide that content in English mode
5. THE System SHALL support limited English content compared to full Polish content

### Requirement 13: Crew List Document Generation

**User Story:** As a skipper, I want to generate a crew list document for a trip, so that I have official documentation of all crew members for legal and safety purposes.

#### Acceptance Criteria

1. WHEN a skipper requests a crew list for a trip, THE System SHALL generate a PDF document
2. THE Crew_List SHALL include all crew members with approved bookings for the specified trip
3. THE Crew_List SHALL display personal information including name, date of birth, passport number, and qualifications
4. THE Crew_List SHALL be accessible only to the skipper and owner roles
5. THE System SHALL generate the crew list on demand without storing the PDF
6. THE System SHALL allow printing and saving of the generated crew list

### Requirement 14: Opinia z Rejsu Document Generation

**User Story:** As a crew member, I want to receive a post-trip evaluation document after completing a trip, so that I have official documentation of my sailing experience.

#### Acceptance Criteria

1. WHEN a crew member requests an Opinia z Rejsu after trip completion, THE System SHALL generate a PDF document
2. THE Opinia_z_Rejsu SHALL include the crew member's personal information and trip details including trip number, city, and date
3. THE Opinia_z_Rejsu SHALL include trip statistics (miles sailed, days, hours, conditions)
4. THE Opinia_z_Rejsu SHALL include a recommendation field (yes/no) filled by the skipper
5. THE Opinia_z_Rejsu SHALL include a notes field filled by the skipper
6. THE Opinia_z_Rejsu SHALL be accessible only to the specific crew member it concerns
7. THE System SHALL generate the document on demand without storing the PDF
8. THE System SHALL allow printing and saving of the generated document

### Requirement 15: Map Generation for Sailing Routes

**User Story:** As a content editor, I want to display simplified sailing route maps on blog posts, so that readers can visualize trip locations and routes.

#### Acceptance Criteria

1. WHEN a blog post includes route data, THE System SHALL generate a map using Leaflet.js and OpenStreetMap
2. THE System SHALL display simplified routes following coastlines
3. THE System SHALL NOT display GPS tracks or straight lines over land
4. THE System SHALL render maps without requiring paid mapping services

### Requirement 16: Image Optimization and Storage

**User Story:** As a system administrator, I want to optimize and store images cost-effectively, so that the website loads quickly while minimizing hosting costs.

#### Acceptance Criteria

1. WHERE cost-effective, THE System SHALL use Cloudinary free tier for image storage
2. WHERE Cloudinary is not suitable, THE System SHALL use self-hosted storage with sharp optimization
3. THE System SHALL optimize all images for web display
4. THE System SHALL handle image-heavy content efficiently

### Requirement 17: Deployment and Hosting

**User Story:** As a developer, I want to deploy the system on cost-effective hosting with automatic deployments, so that updates are seamless and costs remain minimal.

#### Acceptance Criteria

1. THE System SHALL deploy the frontend to Netlify or Vercel free tier
2. THE System SHALL auto-deploy from Git repository on commits
3. THE System SHALL host the backend on a cheap VPS or Railway/Render free tier
4. THE System SHALL use PostgreSQL database for relational data
5. THE System SHALL maintain total hosting costs between $0-10 per month
6. THE System SHALL minimize external provider lock-in

### Requirement 18: System Architecture Separation

**User Story:** As a system architect, I want clear separation between content storage and application data, so that the system is maintainable and scalable.

#### Acceptance Criteria

1. THE System SHALL store content (blog posts, static pages) as Markdown files in Git repository
2. THE System SHALL store user data, bookings, and qualifications in PostgreSQL database
3. THE System SHALL maintain clear data relationships between users, bookings, and trips
4. WHEN content structure changes, THE System SHALL NOT require database schema changes
5. WHEN user data structure changes, THE System SHALL NOT require content file format changes

### Requirement 19: Responsive Design

**User Story:** As a user, I want to access the website on both desktop and mobile devices, so that I can browse trips and manage bookings from anywhere.

#### Acceptance Criteria

1. THE System SHALL provide responsive layouts that adapt to different screen sizes
2. THE System SHALL optimize the user interface for both desktop and mobile devices
3. WHEN viewed on mobile, THE System SHALL adjust layout, navigation, and content presentation for smaller screens
4. WHEN viewed on desktop, THE System SHALL take advantage of larger screen space for richer layouts
5. THE System SHALL ensure all functionality is accessible on both mobile and desktop devices
