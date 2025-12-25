"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, {
  LatLngTuple,
  LeafletMouseEvent,
  Marker as LeafletMarker,
} from "leaflet";

import { MapInputProps, LatLng } from "../../schemas/mapInputSchema";

import { StaticImageData } from "next/image";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import React, { useMemo } from "react";
import GeocoderController from "./GeocoderController";
import MapRecenter from "./MapRecenter";

const markerIcon = icon as StaticImageData;
const markerShadow = iconShadow as StaticImageData;

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Updated Interface: accept onPositionChange instead of setPosition
interface LocationMarkerProps {
  position: LatLng | null;
  onPositionChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onPositionChange }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      // DIRECTLY notify parent. Do not set local state.
      onPositionChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend(e: L.LeafletEvent) {
        const marker = e.target as L.Marker;
        const newPosition = marker.getLatLng();
        // DIRECTLY notify parent.
        onPositionChange(newPosition.lat, newPosition.lng);
      },
    }),
    [onPositionChange]
  );

  if (position === null) {
    return null;
  }

  const markerPosition: LatLngTuple = [position.lat, position.lng];

  return (
    <Marker position={markerPosition} draggable eventHandlers={eventHandlers} />
  );
}

export default function MapInput({
  onCoordinateChange,
  initialPosition, // This is now our Single Source of Truth
  zoom = 13,
}: MapInputProps) {
  // 1. REMOVED internal useState entirely.
  // We rely purely on 'initialPosition' coming from the parent.

  // 2. REMOVED both useEffects.
  // We don't need to sync state, and we definitely don't want to echo back to parent.

  const center: LatLng = initialPosition;

  const initialCenterSafe: LatLngTuple = [
    initialPosition.lat,
    initialPosition.lng,
  ];

  // Wrapper to match the expected signature
  const handleMapInteraction = (lat: number, lng: number) => {
    onCoordinateChange({ lat, lng });
  };

  return (
    <MapContainer
      center={initialCenterSafe}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* MapRecenter will handle moving the view when you type numbers manually */}
      <MapRecenter center={center} zoom={zoom} />

      <GeocoderController onLocationFound={handleMapInteraction} />

      <LocationMarker
        position={initialPosition}
        onPositionChange={handleMapInteraction}
      />
    </MapContainer>
  );
}
