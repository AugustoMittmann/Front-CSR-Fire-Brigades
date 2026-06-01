// Server-side prototype. Do NOT import this from a client component — it ships
// the @googlemaps/google-maps-services-js SDK and reads a server-only API key.
// When this is productionised, expose it via a Route Handler
// (e.g. src/app/api/geocode/route.js) so the key never reaches the browser.
import "server-only";
import { Client } from '@googlemaps/google-maps-services-js';

const testAddressSAP = "Avenida SAP, 188 - Cristo Rei, São Leopoldo - RS, 93022-718";

export async function convertToLatLng(address = testAddressSAP) {
  const northeast = { lat:  5.271944, lng: -34.793056 };
  const southwest = { lat: -33.751111, lng: -73.990556 };
  const brazilBounds = {northeast, southwest};
  const payload = {
    params: {
      key: process.env.GOOGLE_MAPS_GEOCODING_KEY,
      address,
      bounds: brazilBounds
    }
  };

  const client = new Client();

  try {
    const response = await client.geocode(payload)
    const str = JSON.stringify(response.data.results[0]);
    const latlng = JSON.stringify(response.data.results[0].geometry.location);
    console.log(`response is: ${str}`);
    console.log(`Lat/Lng is: ${latlng}`);
  } catch (err) {
    console.error(err);
  }
}
