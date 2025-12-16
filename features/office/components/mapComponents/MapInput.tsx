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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

interface LocationMarkerProps {
  position: LatLng | null;
  setPosition: React.Dispatch<React.SetStateAction<LatLng>>;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend(e: L.LeafletEvent) {
        const marker = e.target as L.Marker;
        const newPosition = marker.getLatLng();
        setPosition({ lat: newPosition.lat, lng: newPosition.lng });
      },
    }),

    [setPosition]
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
  initialPosition,
  zoom = 13,
}: MapInputProps) {
  const [position, setPosition] = useState<LatLng>(initialPosition);

  useEffect(() => {
    onCoordinateChange(position);
  }, [position, onCoordinateChange]);

  useEffect(() => {
    setPosition((prevPosition) => {
      const isDifferent =
        prevPosition.lat !== initialPosition.lat ||
        prevPosition.lng !== initialPosition.lng;

      if (isDifferent) {
        return initialPosition;
      }

      return prevPosition;
    });
  }, [initialPosition.lat, initialPosition.lng, setPosition]);

  // const center: LatLngTuple = [position.lat, position.lng];
  const center: LatLng = position;

  // const initialCenter: LatLngTuple = [initialPosition.lat, initialPosition.lng];
  const initialCenterSafe: LatLngTuple = [
    initialPosition.lat,
    initialPosition.lng,
  ];

  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setPosition({ lat, lng });
  }, []);

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

      <MapRecenter center={center} zoom={zoom} />

      <GeocoderController onLocationFound={handleLocationFound} />

      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
