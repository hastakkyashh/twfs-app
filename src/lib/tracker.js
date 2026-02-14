/**
 * TWFS User Behavior Tracker
 * 
 * Lightweight client-side tracking SDK for user behavior analytics.
 * - Manages visitor_id cookie (1 year expiry)
 * - Generates session_id per tab
 * - Auto-tracks page views and clicks on [data-track] elements
 * - Batches events and flushes every 5 seconds or on page unload
 * - Tracks email copies and social link clicks
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  COOKIE_NAME: 'twfs_vid',
  COOKIE_EXPIRY_DAYS: 365,
  SESSION_KEY: 'twfs_sid',
  BATCH_INTERVAL_MS: 5000,
  TRACK_ENDPOINT: '/api/telemetry/track',
  IDENTIFY_ENDPOINT: '/api/telemetry/identify',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a UUID v4
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get a cookie value by name
 */
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Set a cookie with expiry in days
 */
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Get or create session ID (persists in sessionStorage for tab lifetime)
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem(CONFIG.SESSION_KEY);
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem(CONFIG.SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Get or create visitor ID (persists in cookie for 1 year)
 */
function getVisitorId() {
  let visitorId = getCookie(CONFIG.COOKIE_NAME);
  if (!visitorId) {
    visitorId = generateUUID();
    setCookie(CONFIG.COOKIE_NAME, visitorId, CONFIG.COOKIE_EXPIRY_DAYS);
  }
  return visitorId;
}

// ============================================================================
// TRACKER CLASS
// ============================================================================

class Tracker {
  constructor() {
    this.visitorId = getVisitorId();
    this.sessionId = getSessionId();
    this.eventQueue = [];
    this.flushTimer = null;
    this.initialized = false;
  }

  /**
   * Initialize the tracker - call once on app mount
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Start batch flush timer
    this.startFlushTimer();

    // Auto-track page views on hash change
    this.trackPageView();
    window.addEventListener('hashchange', () => this.trackPageView());

    // Auto-track clicks on [data-track] elements
    document.addEventListener('click', (e) => this.handleClick(e), true);

    // Track copy events (for email copying)
    document.addEventListener('copy', (e) => this.handleCopy(e));

    // Flush on page unload
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
    window.addEventListener('beforeunload', () => this.flush());

    console.log('[Tracker] Initialized', { visitorId: this.visitorId, sessionId: this.sessionId });
  }

  /**
   * Start the batch flush timer
   */
  startFlushTimer() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => this.flush(), CONFIG.BATCH_INTERVAL_MS);
  }

  /**
   * Queue an event for batching
   */
  track(eventType, data = {}) {
    const event = {
      event_type: eventType,
      page: window.location.hash || '#home',
      element: data.element || null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      timestamp: new Date().toISOString(),
    };
    this.eventQueue.push(event);
  }

  /**
   * Track a page view
   */
  trackPageView() {
    const page = window.location.hash || '#home';
    this.track('page.view', { metadata: { page } });
  }

  /**
   * Handle click events - track [data-track] elements and social links
   */
  handleClick(e) {
    const target = e.target.closest('[data-track]');
    if (target) {
      const trackId = target.getAttribute('data-track');
      this.track('ui.click', { element: trackId });
    }

    // Track social media link clicks
    const link = e.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      if (this.isSocialLink(href)) {
        this.track('social.click', {
          element: 'social-link',
          metadata: { href, platform: this.getSocialPlatform(href) },
        });
      }
      // Track mailto clicks
      if (href && href.startsWith('mailto:')) {
        this.track('contact.email_click', {
          element: 'email-link',
          metadata: { email: href.replace('mailto:', '') },
        });
      }
      // Track tel clicks
      if (href && href.startsWith('tel:')) {
        this.track('contact.phone_click', {
          element: 'phone-link',
          metadata: { phone: href.replace('tel:', '') },
        });
      }
    }
  }

  /**
   * Handle copy events - detect email copying
   */
  handleCopy(e) {
    const selection = window.getSelection().toString().trim();
    // Simple email regex check
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selection)) {
      this.track('contact.email_copy', {
        element: 'email-copy',
        metadata: { email: selection },
      });
    }
  }

  /**
   * Check if a URL is a social media link
   */
  isSocialLink(href) {
    if (!href) return false;
    const socialDomains = [
      'facebook.com', 'fb.com',
      'twitter.com', 'x.com',
      'instagram.com',
      'linkedin.com',
      'youtube.com',
      'whatsapp.com', 'wa.me',
    ];
    return socialDomains.some((domain) => href.includes(domain));
  }

  /**
   * Get social platform name from URL
   */
  getSocialPlatform(href) {
    if (!href) return 'unknown';
    if (href.includes('facebook') || href.includes('fb.com')) return 'facebook';
    if (href.includes('twitter') || href.includes('x.com')) return 'twitter';
    if (href.includes('instagram')) return 'instagram';
    if (href.includes('linkedin')) return 'linkedin';
    if (href.includes('youtube')) return 'youtube';
    if (href.includes('whatsapp') || href.includes('wa.me')) return 'whatsapp';
    return 'unknown';
  }

  /**
   * Flush queued events to the server
   */
  flush() {
    if (this.eventQueue.length === 0) return;

    const payload = {
      visitor_id: this.visitorId,
      session_id: this.sessionId,
      events: [...this.eventQueue],
    };

    // Clear queue immediately to avoid duplicates
    this.eventQueue = [];

    // Use sendBeacon for reliability on page unload
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const sent = navigator.sendBeacon(CONFIG.TRACK_ENDPOINT, blob);

    if (!sent) {
      // Fallback to fetch if sendBeacon fails
      fetch(CONFIG.TRACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => console.error('[Tracker] Flush failed:', err));
    }
  }

  /**
   * Identify the user with an email address
   * Called when user subscribes or provides their email
   */
  identify(email) {
    if (!email || typeof email !== 'string') return;

    const payload = {
      visitor_id: this.visitorId,
      email: email.trim().toLowerCase(),
    };

    // Track the identify event locally
    this.track('user.identify', { metadata: { email: payload.email } });

    // Send to identify endpoint
    fetch(CONFIG.IDENTIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('[Tracker] Identify failed:', err));
  }

  /**
   * Track a custom event
   */
  trackEvent(eventType, element = null, metadata = null) {
    this.track(eventType, { element, metadata });
  }

  /**
   * Get current visitor ID (for external use)
   */
  getVisitorId() {
    return this.visitorId;
  }

  /**
   * Get current session ID (for external use)
   */
  getSessionId() {
    return this.sessionId;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const tracker = new Tracker();

export default tracker;
export { tracker };
