"use client";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const Geocoder = (L.Control as any).Geocoder;

interface GeocodeControlProps {
  onLocationFound: (lat: number, lng: number) => void;
}

export default function GeocoderController({
  onLocationFound,
}: GeocodeControlProps) {
  const map = useMap();

  useEffect(() => {
    const geocoder = new Geocoder({
      defaultMarkGeocode: false,
    });

    geocoder.on("markgeocode", (e: any) => {
      const center = e.geocode.center;

      onLocationFound(center.lat, center.lng);
    });

    geocoder.addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map, onLocationFound]);

  return null;
}
