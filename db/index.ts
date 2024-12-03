import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, changelogs, changelogVersions, changelogEntries } from './schema';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('DATABASE_URL must be a Neon postgres connection string')
}
const sql = neon(process.env.NEON_DATABASE_URL!);

export const db = drizzle(sql, {
  schema: { 
    users,
    changelogs,
    changelogVersions,
    changelogEntries
  }
});

// Optionally add retry logic
const executeWithRetry = async (query: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await query;
    } catch (error: any) {
      if (i === retries - 1) throw error;
      console.warn(`Database query failed, attempt ${i + 1} of ${retries}:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
    }
  }
};