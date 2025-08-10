// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.DATABASE_URL!);
 
