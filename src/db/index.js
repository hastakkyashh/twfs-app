import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema.js';

/**
 * Create a Drizzle DB instance from a D1 binding
 * @param {D1Database} d1 - The D1 database binding from context.env
 * @returns {DrizzleD1Database} Typed Drizzle database instance
 */
export function createDb(d1) {
  return drizzle(d1, { schema });
}

export { schema };
