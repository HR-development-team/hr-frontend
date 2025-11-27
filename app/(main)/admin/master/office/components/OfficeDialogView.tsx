import { LatLng } from "@/lib/types/mapInput";
import { GetOfficeByIdData } from "@/lib/types/office";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { Building, Navigation } from "lucide-react";
import { Card } from "primereact/card";
import OfficeDialogViewSkeleton from "./OfficeDialogViewSkeleton";
import dynamic from "next/dynamic";

const InternalMapInput = dynamic(
  () => import("./mapComponents/InternalMapInput"),
  {
    ssr: false,
  }
);

export default function OfficeDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetOfficeByIdData>) {
  const isOnViewMode = dialogMode === "view";

  const mapPosition = {
    lat: parseFloat(data?.latitude ?? "0") || -6.2,
    lng: parseFloat(data?.longitude ?? "0") || 106.816666,
  };

  const handleCoordinateChange = (pos: LatLng) => {};

  if (isLoading) {
    return <OfficeDialogViewSkeleton />;
  }

  return (
    <div>
      <div className={isOnViewMode ? "line-height-3 text-800" : "hidden"}>
        <Card>
          <div className="flex align-items-center gap-2 mb-4">
            <Building className="text-blue-500" />
            <span className="font-medium">Detail Data Kantor</span>
          </div>

          <div className="grid">
            <div className="col-12 lg:col-4">
              <h2 className="mb-2">
                {data?.name ? data.name : "Kantor belum diberi nama"}
              </h2>
              <div className="flex flex-column gap-4">
                <div className="w-full text-base font-medium">
                  <span className="text-500">Alamat Lengkap</span>
                  <p className="p-2 bg-gray-100 border-round-lg">
                    {data?.address ? data.address : "-"}
                  </p>
                </div>

                <div className="flex justify-content-between">
                  <div className="text-base font-medium">
                    <span className="text-500">Latitude</span>
                    <p className="bg-gray-100 p-2 border-round-lg font-mono">
                      {data?.latitude ? data.latitude : "-"}
                    </p>
                  </div>
                  <div className="text-base font-medium">
                    <span className="text-500">Longitude</span>
                    <p className="bg-gray-100 p-2 border-round-lg font-mono">
                      {data?.longitude ? data.longitude : "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full text-base font-medium">
                  <span className="text-500">Radius Kantor</span>
                  <p>{data?.radius_meters ? data.radius_meters : 0} meter</p>
                </div>
              </div>
            </div>

            <div className="col-12 lg:col-8">
              <h3 className="font-semibold mb-2">Lokasi Dalam Peta</h3>
              <InternalMapInput
                initialPosition={mapPosition}
                onCoordinateChange={handleCoordinateChange}
              />

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapPosition.lat},${mapPosition.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex align-items-center justify-content-center gap-2 w-full p-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white border-round no-underline font-medium transition-colors duration-200 cursor-pointer"
              >
                <Navigation size={16} />
                <span>Buka di Google Maps</span>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
