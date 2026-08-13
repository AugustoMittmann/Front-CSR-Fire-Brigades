/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hosts permitidos para o componente <Image> do Next. Qualquer URL externa
  // usada em <Image src=...> precisa ter o hostname listado aqui, senão o
  // Next throwsa "Invalid src prop".
  // - images.unsplash.com: imagens de seed/dev. Em produção, troque por seu
  //   próprio bucket (Supabase Storage) e adicione esse host aqui também.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Baseline response headers. A Content-Security-Policy is shipped in
  // Report-Only mode first: it interacts with Google Maps, Auth0, Google Fonts
  // and Supabase, so it is tuned via violation reports before being enforced.
  // To enforce: rename the header key to "Content-Security-Policy" once the
  // browser console shows no legitimate violations (Next's inline bootstrap may
  // require a nonce/hash under a strict script-src).
  async headers() {
    const csp = [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "script-src 'self' 'unsafe-inline' https://*.auth0.com https://maps.googleapis.com",
      "connect-src 'self' https://*.auth0.com https://maps.googleapis.com https://*.supabase.co",
      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://maps.gstatic.com https://*.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://*.auth0.com https://*.google.com",
    ].join("; ");

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
          { key: "Content-Security-Policy-Report-Only", value: csp },
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
