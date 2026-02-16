/**
 * Cloudflare Pages Function — User Identity Resolution
 * POST /api/telemetry/identify
 * 
 * Links an email to a visitor_id.
 * If the email already exists under a different visitor_id, merges the old data.
 */

import { createDb } from '../../../src/db/index.js';
import { visitors, events, sessions, subscribers } from '../../../src/db/schema.js';
import { eq, and, ne } from 'drizzle-orm';

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await context.request.json();
    const { visitor_id, email, name } = body;

    // Validate required fields
    if (!visitor_id || !email) {
      return new Response(
        JSON.stringify({ error: 'visitor_id and email are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = createDb(context.env.twfs_telemetry);

    // // console.log(`[identify] Processing identity for visitor_id: ${visitor_id}, email: ${normalizedEmail}`);

    // Check if this email already exists under a DIFFERENT visitor_id
    const existingVisitor = await db
      .select({ visitorId: visitors.visitorId })
      .from(visitors)
      .where(and(eq(visitors.email, normalizedEmail), ne(visitors.visitorId, visitor_id)))
      .get();

    if (existingVisitor) {
      // Merge: transfer all data from old visitor_id to current visitor_id
      const oldVisitorId = existingVisitor.visitorId;
      // // console.log(`[identify] Merging data from old visitor_id: ${oldVisitorId} to new: ${visitor_id}`);

      // Update events to point to new visitor_id
      await db.update(events)
        .set({ visitorId: visitor_id })
        .where(eq(events.visitorId, oldVisitorId))
        .run();

      // Update sessions to point to new visitor_id
      await db.update(sessions)
        .set({ visitorId: visitor_id })
        .where(eq(sessions.visitorId, oldVisitorId))
        .run();

      // Delete the old visitor record
      await db.delete(visitors)
        .where(eq(visitors.visitorId, oldVisitorId))
        .run();

      // Update subscriber record to new visitor_id
      await db.update(subscribers)
        .set({ visitorId: visitor_id })
        .where(eq(subscribers.visitorId, oldVisitorId))
        .run();

      // // console.log(`[identify] Merge completed successfully`);
    }

    // Upsert current visitor with email
    await db.insert(visitors)
      .values({
        visitorId: visitor_id,
        email: normalizedEmail,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: visitors.visitorId,
        set: {
          email: normalizedEmail,
          lastSeenAt: new Date().toISOString(),
        },
      })
      .run();

    // Upsert into subscribers table
    await db.insert(subscribers)
      .values({
        email: normalizedEmail,
        visitorId: visitor_id,
        subscribedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          visitorId: visitor_id,
        },
      })
      .run();

    // // console.log(`[identify] Identity linked successfully for visitor: ${visitor_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        merged: !!existingVisitor,
        message: existingVisitor ? 'Identity merged from previous visitor' : 'Identity linked'
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telemetry identify error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to identify user' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
