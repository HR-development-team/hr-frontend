"use client";

import { LatLng } from "@/lib/types/mapInput";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

interface MapRecenterProps {
  center: LatLng;
}

export default function MapRecenter({ center }: MapRecenterProps) {
  const map = useMap();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      map.setView([center.lat, center.lng], 13);
      return;
    }
    map.flyTo(center, 13);
  }, [map, center.lat, center.lng]);

  return null;
}
