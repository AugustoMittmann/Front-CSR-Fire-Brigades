'use client'

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function GoogleMap({brigadesCoordinates = [], fill = false}) {
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState({lat: -14.235004, lng: -51.92528});

  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition((position) => {
      setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
      setZoom(10);
    });
  }, []);

  const famousLocations =[
    [-23.5475, -46.63611],
    [-22.90642, -43.18223],
    [-19.92083, -43.93778],
    [-12.97563, -38.49096],
    [-3.71722, -38.54306],
    [-3.10194, -60.025],
    [-15.77972, -47.92972],
    [-25.42778, -49.27306],
    [-8.05389, -34.88111],
    [-16.67861, -49.25389],
    [-1.45583, -48.50444],
    [-30.03283, -51.23019],
    [-23.46278, -46.53333],
    [-9.66583, -35.73528],
    [-22.90556, -47.06083],
    [-2.52972, -44.30278],
    [-20.44278, -54.64639],
    [-5.795, -35.20944],
    [-5.08917, -42.80194],
    [-22.75917, -43.45111]
  ]
  brigadesCoordinates = [
    ...brigadesCoordinates,
    ...famousLocations.map(([lat, lng]) => ({lat, lng}))
  ]

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
      <div style={fill ? {height: "100%", width: "100%"} : {height: "25rem", width: "25rem"}}>
        <Map defaultCenter={center} defaultZoom={zoom} mapId={process.env.NEXT_PUBLIC_MAP_ID} controlSize={1}>
          {brigadesCoordinates.map(({lat, lng}, index) => (
            <AdvancedMarker
              key={index}
              position={{lat, lng}}
              title={`Famous Location ${index + 1}`}
              options={{
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                }
              }}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
