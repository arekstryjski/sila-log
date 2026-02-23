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

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and database clients
- `/content` - Markdown content (blog, pages, destinations)
- `/locales` - Translation files (pl.json, en.json)

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## License

Private
