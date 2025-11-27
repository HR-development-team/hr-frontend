import { LatLng, MapInputProps } from "@/lib/types/mapInput";
import { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import L from 'leaflet'
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { StaticImageData } from "next/image";
import { MapContainer, TileLayer } from "react-leaflet";
import MapRecenter from "./MapRecenter";
import LocationMarker from "./LocationMarker";


const markerIcon = icon as StaticImageData;
const markerShadow = iconShadow as StaticImageData;

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function InternalMapInput({
  initialPosition,
  onCoordinateChange,
}: MapInputProps) {
  const [position, setPosition] = useState<LatLng>(initialPosition);

  useEffect(() => {
    onCoordinateChange(position);
  }, [position, onCoordinateChange]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.lat, initialPosition.lng]);

  const initialCenterSafe: LatLngTuple = [
    initialPosition.lat,
    initialPosition.lng,
  ];

  return (
    <div
      className="w-full border-round-lg overflow-hidden border-1 surface-border relative z-0"
      style={{ height: "300px" }}
    >
      <MapContainer
        center={initialCenterSafe}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={position} />
        <LocationMarker position={position} />
      </MapContainer>
    </div>
  );
}
