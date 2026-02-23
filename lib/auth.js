import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Count existing Owner accounts
async function countOwners() {
  const result = await pool.query(
    "SELECT COUNT(*) FROM users WHERE role = 'Owner'"
  );
  return parseInt(result.rows[0].count);
}

export const authConfig = {
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if user exists in database
      const result = await pool.query(
        "SELECT role FROM users WHERE email = $1",
        [user.email]
      );
      
      // If user doesn't exist, they'll be created with default role
      if (result.rows.length === 0) {
        // Default role is 'Crew_Member' (set by database default)
        return true;
      }
      
      return true;
    },
    async session({ session, user }) {
      // Add role to session
      if (session?.user) {
        const result = await pool.query(
          "SELECT role FROM users WHERE email = $1",
          [session.user.email]
        );
        
        if (result.rows.length > 0) {
          session.user.role = result.rows[0].role;
          session.user.id = user.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
