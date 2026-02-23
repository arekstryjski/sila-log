import { auth } from "./auth";
import { NextResponse } from "next/server";

/**
 * Require authentication for API routes
 * Returns the session if authenticated, or an error response
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 }
      ),
      session: null,
    };
  }
  
  return { error: null, session };
}

/**
 * Require specific role(s) for API routes
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * Returns the session if authorized, or an error response
 */
export async function requireRole(allowedRoles) {
  const { error, session } = await requireAuth();
  
  if (error) {
    return { error, session: null };
  }
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roles.includes(session.user.role)) {
    return {
      error: NextResponse.json(
        { 
          error: "Forbidden - Insufficient permissions",
          required: roles,
          current: session.user.role
        },
        { status: 403 }
      ),
      session: null,
    };
  }
  
  return { error: null, session };
}

/**
 * Check if user has Owner role
 */
export async function isOwner() {
  const session = await auth();
  return session?.user?.role === "Owner";
}

/**
 * Check if user has Skipper or Owner role
 */
export async function isSkipperOrOwner() {
  const session = await auth();
  return ["Skipper", "Owner"].includes(session?.user?.role);
}

/**
 * Check if user has Crew_Member role (or any authenticated user)
 */
export async function isCrewMember() {
  const session = await auth();
  return session?.user?.role === "Crew_Member";
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}
