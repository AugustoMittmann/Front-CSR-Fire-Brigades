/** @type {import('next').NextConfig} */
const nextConfig = {
  // Baseline response headers. CSP is intentionally omitted here — it interacts
  // with Google Maps, Auth0, and Google Fonts and warrants a dedicated review
  // before being added.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // /frequentQuestionsPage was an orphan duplicate of /FAQPage; preserve any
      // outstanding links by redirecting permanently.
      {
        source: "/frequentQuestionsPage",
        destination: "/FAQPage",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
