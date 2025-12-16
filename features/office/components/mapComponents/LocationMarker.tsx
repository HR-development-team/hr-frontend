import { LatLng } from "../../schemas/mapInputSchema";
import { Marker } from "react-leaflet";

export default function LocationMarker({
  position,
}: {
  position: LatLng | null;
}) {
  if (position === null) return null;

  return <Marker position={[position.lat, position.lng]} draggable={false} />;
}
