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
