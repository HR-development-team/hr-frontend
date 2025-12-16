import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LatLng } from "leaflet"; // Adjust import based on your types

interface MapRecenterProps {
  center: LatLng | { lat: number; lng: number };
  zoom?: number; // Add zoom prop
}

export default function MapRecenter({ center, zoom }: MapRecenterProps) {
  const map = useMap();

  useEffect(() => {
    // If zoom is provided, set view with zoom. Otherwise, keep current zoom.
    const targetZoom = zoom || map.getZoom();

    // Smoothly fly to the new center and zoom level
    map.flyTo([center.lat, center.lng], targetZoom, {
      duration: 1.5, // Optional: animation duration
    });
  }, [center, zoom, map]);

  return null;
}
