import { Client } from "@googlemaps/google-maps-services-js";

/**
 * Reverse geocoding: lat/lng -> UF (código do estado brasileiro).
 *
 * Roda no servidor de propósito, para a chave de geocoding NUNCA chegar ao
 * browser (mesma orientação do src/lib/prototypes/prototype_location_converter.js).
 * O front chama GET /api/geocode/reverse?lat=..&lng=.. e recebe { state: "RS" }.
 *
 * Requer GOOGLE_MAPS_GEOCODING_KEY no ambiente. Sem ela, responde 503 para o
 * front exibir uma mensagem clara em vez de quebrar.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return Response.json(
      { error: { code: "bad_request", message: "lat/lng inválidos." } },
      { status: 400 },
    );
  }

  const key = process.env.GOOGLE_MAPS_GEOCODING_KEY;
  if (!key) {
    return Response.json(
      {
        error: {
          code: "not_configured",
          message: "Geocoding não configurado no servidor (GOOGLE_MAPS_GEOCODING_KEY).",
        },
      },
      { status: 503 },
    );
  }

  try {
    const client = new Client();
    const res = await client.reverseGeocode({
      params: { key, latlng: `${lat},${lng}`, language: "pt-BR" },
    });

    // Procura o componente de estado (administrative_area_level_1). No Brasil o
    // short_name já é a UF de 2 letras (ex.: "RS", "SP").
    let uf = null;
    for (const result of res.data.results ?? []) {
      const comp = (result.address_components ?? []).find((c) =>
        c.types.includes("administrative_area_level_1"),
      );
      if (comp?.short_name && /^[A-Za-z]{2}$/.test(comp.short_name)) {
        uf = comp.short_name.toUpperCase();
        break;
      }
    }

    if (!uf) {
      return Response.json(
        { error: { code: "not_found", message: "Não foi possível determinar o estado." } },
        { status: 404 },
      );
    }

    return Response.json({ state: uf });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[geocode/reverse] falhou", err);
    return Response.json(
      { error: { code: "geocode_failed", message: "Falha ao consultar a geolocalização." } },
      { status: 502 },
    );
  }
}
