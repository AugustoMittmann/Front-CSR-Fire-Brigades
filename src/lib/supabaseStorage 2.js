/**
 * Supabase Storage helper for admin image uploads.
 *
 * The backend accepts image URLs as strings; there is no upload endpoint.
 * `sql/0001_initial_schema.sql` documents the intended pattern: SPA uploads
 * to a public Supabase Storage bucket, then submits the resulting public URL.
 *
 * This module lazily creates a Supabase client only when Storage is used —
 * we don't need it for auth (that's Auth0). If the env vars aren't set,
 * `uploadPublicImage` throws a helpful error instead of failing on load.
 */

let cachedClient = null;

const getClient = async () => {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local."
    );
  }
  // Dynamic import so the admin-only dependency isn't bundled into the
  // public-site JS payload — webpack will still resolve it at build time and
  // split it into its own chunk.
  const { createClient } = await import("@supabase/supabase-js");
  cachedClient = createClient(url, key, { auth: { persistSession: false } });
  return cachedClient;
};

/**
 * Upload a File to the public `images` bucket. Returns the public URL.
 *
 * Folder pattern: `<prefix>/<timestamp>-<random>-<sanitised-name>`. Prefix
 * lets us organise by resource (brigades/, articles/, news/) so a Storage
 * admin can prune orphaned files.
 *
 * @param {File} file
 * @param {{ prefix?: string, bucket?: string }} [opts]
 * @returns {Promise<string>} public URL
 */
export const uploadPublicImage = async (file, { prefix = "misc", bucket = "images" } = {}) => {
  if (!file) throw new Error("Nenhum arquivo selecionado.");
  const client = await getClient();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${prefix}/${stamp}-${rand}-${safeName}`;

  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message || "Falha no upload da imagem.");

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Upload concluído mas URL pública não disponível.");
  return data.publicUrl;
};
