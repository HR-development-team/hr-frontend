// export interface LatLng {
//   lat: number;
//   lng: number;
// }

import { LatLngLiteral } from "leaflet";

export type LatLng = LatLngLiteral;

export interface MapInputProps {
  onCoordinateChange: (position: LatLng) => void;
  initialPosition: LatLng;
}
