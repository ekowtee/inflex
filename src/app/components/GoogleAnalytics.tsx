import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js).
 *
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set, so local
 * development and preview builds stay untracked by default. The CSP in
 * next.config.ts allows the googletagmanager.com script and the
 * google-analytics.com collection endpoints.
 *
 * IP anonymisation is the GA4 default. `send_page_view` is left on because
 * the App Router performs full navigations from GA's point of view only on
 * hard loads; gtag's own history-change tracking ("enhanced measurement",
 * enabled in the GA4 property) covers client-side route changes.
 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
