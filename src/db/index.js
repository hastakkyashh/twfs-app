import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema.js';

export function createDb(d1) {
  return drizzle(d1, { schema });
}

export { schema };
