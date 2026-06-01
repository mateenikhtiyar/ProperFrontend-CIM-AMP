// GA4 Analytics utility
// Measurement ID is set in app/layout.tsx (NEXT_PUBLIC_GA4_MEASUREMENT_ID
// or the hardcoded fallback G-F8R0BW67TD for app.cimamplify.com).
// All helpers are safe to call during SSR — they no-op when window.gtag
// is not yet present.

type GtagFn = (...args: any[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: any[];
  }
}

const getGtag = (): GtagFn | null => {
  if (typeof window !== "undefined" && window.gtag) {
    return window.gtag;
  }
  return null;
};

// Track a custom GA4 event
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  const gtag = getGtag();
  if (gtag) {
    gtag("event", eventName, params);
  }
};

// Manually fire a page_view. App Router doesn't auto-emit page_view on
// client-side navigation, so the <PageViewTracker /> component watches
// pathname + searchParams and calls this on change.
export const trackPageView = (pagePath: string) => {
  trackEvent("page_view", { page_path: pagePath });
};

// Predefined CIM Amplify events
export const ga4Events = {
  // Existing form-step events (kept for backward compatibility with the
  // existing analytics dashboards built around them).
  formStartBuyer: () =>
    trackEvent("form_start_buyer", {
      event_category: "registration",
      event_label: "buyer_registration_started",
    }),

  formStartSeller: () =>
    trackEvent("form_start_seller", {
      event_category: "registration",
      event_label: "seller_registration_started",
    }),

  formEndBuyer: () =>
    trackEvent("form_end_buyer", {
      event_category: "registration",
      event_label: "buyer_registration_completed",
    }),

  formEndSeller: () =>
    trackEvent("form_end_seller", {
      event_category: "registration",
      event_label: "seller_registration_completed",
    }),

  // Standard GA4 conversion events (no PII — IDs only).
  signUpBuyer: () => trackEvent("sign_up", { method: "buyer" }),
  signUpSeller: () => trackEvent("sign_up", { method: "seller" }),

  login: (method: "buyer" | "seller") => trackEvent("login", { method }),

  dealAdded: (dealId: string) => trackEvent("deal_added", { deal_id: dealId }),

  dealInterest: (dealId: string) =>
    trackEvent("deal_interest", { deal_id: dealId }),
};
