import { LatLng } from "@/lib/types/mapInput";
import { GetOfficeByIdData } from "@/lib/types/office";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import {
  Building,
  Map,
  MapPinned,
  Navigation,
  Network,
  QrCode,
  Radius,
} from "lucide-react";
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

  const titleTemplate = () => {
    return (
      <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
        <div className="flex gap-2 align-items-start">
          <div className="p-2 bg-white flex align-items-center border-round-xl">
            <Building className="text-blue-500" size={32} />
          </div>
          <div className="flex flex-column justify-content-start gap-1">
            <span className="font-medium text-sm text-blue-600">
              DETAIL KANTOR
            </span>
            <h2 className=" text-lg">
              {data?.name ? data.name : "Kantor belum diberi nama"}
            </h2>
            <div className="flex gap-2 align-items-center p-1 border-round-sm bg-blue-600 text-white max-w-min">
              <QrCode size={14} />
              <span className="font-mono text-sm font-normal">
                {data?.office_code ? data.office_code : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={isOnViewMode ? "line-height-3 text-800" : "hidden"}>
        <Card title={titleTemplate}>
          <div className="grid">
            <div className="col-12 lg:col-4">
              <div className="flex flex-column gap-4">
                <div className="w-full text-base font-medium">
                  <div className="flex align-items-center gap-2 text-400 mb-2">
                    <Network size={14} />
                    <span className="text-xs">CABANG INDUK</span>
                  </div>
                  <p className="p-2 bg-gray-50 border-1 border-gray-100 border-round-lg text-sm">
                    {data?.parent_office_name ? data.parent_office_name : "Ini kantor pusat"}
                  </p>
                </div>
                <div className="w-full text-base font-medium">
                  <div className="flex align-items-center gap-2 text-400 mb-2">
                    <Map size={14} />
                    <span className="text-xs">ALAMAT LENGKAP</span>
                  </div>
                  <p className="p-3 border-left-1 border-gray-200 text-sm">
                    {data?.address ? data.address : "-"}
                  </p>
                </div>

                <div className="flex align-items-center gap-2">
                  <div className="text-base font-medium bg-gray-50 p-3 border-1 border-gray-100 border-round-lg flex flex-column gap-2 w-full">
                    <span className="text-400 text-xs">LATITUDE</span>
                    <p className="font-mono text-sm">
                      {data?.latitude ? data.latitude : "-"}
                    </p>
                  </div>
                  <div className="text-base font-medium bg-gray-50 p-3 border-1 border-gray-100 border-round-lg flex flex-column gap-2 w-full">
                    <span className="text-400 text-xs">LONGITUDE</span>
                    <p className="font-mono text-sm">
                      {data?.longitude ? data.longitude : "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full text-base font-medium">
                  <div className="flex align-items-center gap-2 text-400 mb-2">
                    <Radius size={14} />
                    <span className="text-xs">RADIUS ABSENSI</span>
                  </div>
                  <p className="text-sm">
                    {data?.radius_meters ? data.radius_meters : 0} meter
                  </p>
                </div>

                <div className="w-full text-base font-medium">
                  <p className="text-400 text-xs mb-2">DESKRIPSI</p>
                  <p className="text-sm">
                    {data?.description ? data.description : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 lg:col-8">
              <div className="flex gap-2 align-items-center mb-2 text-400">
                <MapPinned size={14} />
                <span className="font-medium text-xs">LOKASI PETA</span>
              </div>
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
