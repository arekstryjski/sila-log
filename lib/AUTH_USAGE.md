# Authentication Usage Guide

## Overview

The authentication system uses NextAuth.js v5 with PostgreSQL adapter and supports Google, Facebook, and GitHub social login providers.

## Using Auth Helpers in API Routes

Import the helper functions from `lib/auth-helpers.js` in your API routes:

```javascript
import { requireAuth, requireRole } from "@/lib/auth-helpers";

// Example: Require any authenticated user
export async function GET(request) {
  const { error, session } = await requireAuth();
  if (error) return error;
  
  // User is authenticated, proceed with logic
  return Response.json({ user: session.user });
}

// Example: Require specific role
export async function POST(request) {
  const { error, session } = await requireRole(['Skipper', 'Owner']);
  if (error) return error;
  
  // User has required role, proceed with logic
  return Response.json({ success: true });
}
```

## Available Helper Functions

- `requireAuth()` - Require any authenticated user
- `requireRole(roles)` - Require specific role(s) (string or array)
- `isOwner()` - Check if current user is Owner
- `isSkipperOrOwner()` - Check if current user is Skipper or Owner
- `isCrewMember()` - Check if current user is Crew_Member
- `getCurrentUser()` - Get current user session

## User Roles

- **Owner**: Full system access (limited to 2 accounts)
- **Skipper**: Trip management, booking approval, document generation
- **Crew_Member**: Trip viewing, booking creation, profile management (default role)

## Client-Side Usage

Use NextAuth's `useSession` hook in client components:

```javascript
"use client";
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please sign in</div>;
  
  return <div>Welcome {session.user.name}!</div>;
}
```

## Sign In/Out

```javascript
import { signIn, signOut } from "next-auth/react";

// Sign in with provider
signIn("google");
signIn("facebook");
signIn("github");

// Sign out
signOut();
```
