"use client";

import {
  Building,
  Map,
  MapPinned,
  Navigation,
  Network,
  QrCode,
  Radius,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
// 1. Import useState and useEffect
import { useState, useEffect } from "react";

import { OfficeDetail } from "../schemas/officeSchema";
import OfficeViewDialogSkeleton from "./OfficeViewDialogSkeleton";

const InternalMapInput = dynamic(() => import("./mapComponents/MapInput"), {
  ssr: false,
  loading: () => (
    <div className="h-20rem w-full bg-gray-100 border-round flex align-items-center justify-content-center text-gray-500">
      Memuat Peta...
    </div>
  ),
});

interface OfficeViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  office: OfficeDetail | null;
  isLoading: boolean;
}

export default function OfficeViewDialog({
  isOpen,
  onClose,
  office,
  isLoading,
}: OfficeViewDialogProps) {
  // 2. Add state to control when the map should render
  const [isMapReady, setIsMapReady] = useState(false);

  const mapPosition = {
    lat: parseFloat(office?.latitude?.toString() ?? "0") || -6.2,
    lng: parseFloat(office?.longitude?.toString() ?? "0") || 106.816666,
  };

  // 3. Effect: Only render map after Dialog animation completes
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // PrimeReact/Tailwind modals usually take 150-300ms to transition.
      // We wait 300ms to ensure the DIV has full width/height before Leaflet mounts.
      timer = setTimeout(() => {
        setIsMapReady(true);
      }, 300);
    } else {
      // Reset when closed so it re-mounts fresh next time
      setIsMapReady(false);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleCoordinateChange = () => {};

  return (
    <Dialog
      header="Detail Kantor"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-9 xl:w-8"
      footer={
        <div className="flex justify-content-end">
          <Button
            className="flex gap-1"
            label="Tutup"
            icon="pi pi-times"
            text
            onClick={onClose}
          />
        </div>
      }
    >
      {isLoading ? (
        <OfficeViewDialogSkeleton />
      ) : office ? (
        <div className="flex flex-column gap-4 mt-2">
          {/* ... [Header Section Unchanged] ... */}
          <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
            {/* ... header content ... */}
            <div className="flex gap-2 align-items-start">
              <div className="p-2 bg-white flex align-items-center border-round-xl">
                <Building className="text-blue-500" size={32} />
              </div>
              <div className="flex flex-column justify-content-start gap-1">
                <span className="font-medium text-sm text-blue-600">
                  DETAIL KANTOR
                </span>
                <h2 className=" text-lg">
                  {office?.name ? office.name : "Kantor belum diberi nama"}
                </h2>
                <div className="flex gap-2 align-items-center p-1 border-round-sm bg-blue-600 text-white max-w-min">
                  <QrCode size={14} />
                  <span className="font-mono text-sm font-normal">
                    {office?.office_code ? office.office_code : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid">
            {/* Left Column: Details (Unchanged) */}
            <div className="col-12 lg:col-4">
              {/* ... all your detail fields ... */}
              <div className="flex flex-column gap-4">
                {/* Parent Office */}
                <div className="w-full text-base font-medium">
                  <div className="flex align-items-center gap-2 text-400 mb-2">
                    <Network size={14} />
                    <span className="text-xs">CABANG INDUK</span>
                  </div>
                  <p className="p-2 bg-gray-50 border-1 border-gray-100 border-round-lg text-sm">
                    {office?.parent_office_name
                      ? office.parent_office_name
                      : "Ini kantor pusat"}
                  </p>
                </div>

                {/* Address */}
                <div className="w-full text-base font-medium">
                  <div className="flex align-items-center gap-2 text-400 mb-2">
                    <Map size={14} />
                    <span className="text-xs">ALAMAT LENGKAP</span>
                  </div>
                  <p className="p-3 border-left-1 border-gray-200 text-sm">
                    {office?.address ? office.address : "-"}
                  </p>
                </div>

                {/* Lat / Long */}
                <div className="flex align-items-center gap-2">
                  <div className="text-base font-medium bg-gray-50 p-3 border-1 border-gray-100 border-round-lg flex flex-column gap-2 w-full">
                    <span className="text-400 text-xs">LATITUDE</span>
                    <p className="font-mono text-sm">
                      {office?.latitude ? office.latitude : "-"}
                    </p>
                  </div>
                  <div className="text-base font-medium bg-gray-50 p-3 border-1 border-gray-100 border-round-lg flex flex-column gap-2 w-full">
                    <span className="text-400 text-xs">LONGITUDE</span>
                    <p className="font-mono text-sm">
                      {office?.longitude ? office.longitude : "-"}
                    </p>
                  </div>
                </div>

                {/* Radius */}
                <div className="w-full text-base font-medium">
                  <div className="flex align-items-center gap-2 text-400 mb-2">
                    <Radius size={14} />
                    <span className="text-xs">RADIUS ABSENSI</span>
                  </div>
                  <p className="text-sm">
                    {office?.radius_meters ? office.radius_meters : 0} meter
                  </p>
                </div>

                {/* Description */}
                <div className="w-full text-base font-medium">
                  <p className="text-400 text-xs mb-2">DESKRIPSI</p>
                  <p className="text-sm">
                    {office?.description ? office.description : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Map */}
            <div className="col-12 lg:col-8">
              <div className="flex gap-2 align-items-center mb-2 text-400">
                <MapPinned size={14} />
                <span className="font-medium text-xs">LOKASI PETA</span>
              </div>

              <div
                className="w-full border-round overflow-hidden shadow-1 bg-gray-50 border-1 border-gray-200 relative"
                style={{ height: "400px", minHeight: "400px" }}
              >
                {/* 4. Conditional Rendering based on timeout */}
                {isMapReady ? (
                  <InternalMapInput
                    initialPosition={mapPosition}
                    onCoordinateChange={handleCoordinateChange}
                  />
                ) : (
                  // Optional: A placeholder while waiting for the 300ms
                  <div className="h-20rem bg-gray-50 border-round flex align-items-center justify-content-center text-gray-400 text-sm">
                    Memuat Peta...
                  </div>
                )}
              </div>
              <a
                // 5. Fixed broken URL (removed the '0' typo before mapPosition.lat)
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
        </div>
      ) : (
        <div className="text-center p-6 text-gray-500">
          Data kantor tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
